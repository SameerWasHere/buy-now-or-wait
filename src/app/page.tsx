// src/app/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Header from './Header';
import ProductRow from './ProductRow';

type Product = {
  id: number;
  type: string;
  brand: string;
  group: string;
  name: string;
  image_url: string | null;
  release_date: string | null;
  expected_date: string | null;
  avg_cycle: number | null;
  upgraded_after: number | null;
};

const Page: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const RESULTS_PER_PAGE = 10;

  useEffect(() => {
    // Fetch products from API endpoint
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.filter((product: Product) => product.avg_cycle !== null));
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const calculateReleasedDaysAgo = (releaseDate: string | null): number => {
    if (!releaseDate) return 0;
    const release = new Date(releaseDate);
    const today = new Date();
    return Math.floor((today.getTime() - release.getTime()) / (1000 * 60 * 60 * 24));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredProducts.length / RESULTS_PER_PAGE);

  // Get products for the current page
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  // Handle going to the next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle going to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main
        style={{
          backgroundColor: '#f7f7f7',
          paddingTop: '80px',
          paddingRight: '20px',
          paddingBottom: '20px',
          paddingLeft: '20px',
          minHeight: '100vh',
        }}
      >
        {currentProducts.map((product) => {
          const releasedDaysAgo = calculateReleasedDaysAgo(product.release_date);
          const avgCycle = product.avg_cycle ?? 0;
          const expectedUpgradeIn = product.expected_date
            ? Math.floor((new Date(product.expected_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : null;
          const status = calculateStatus(releasedDaysAgo, avgCycle, expectedUpgradeIn);

          return (
            <ProductRow
              key={product.id}
              name={product.name}
              imageUrl={product.image_url}
              releasedDaysAgo={releasedDaysAgo}
              avgCycle={avgCycle}
              expectedUpgradeInDays={expectedUpgradeIn}
              status={status}
            />
          );
        })}

        {/* Pagination Controls */}
        <div style={paginationStyles}>
          <button onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </main>
    </>
  );
};

const calculateStatus = (
  releasedDaysAgo: number,
  avgCycle: number,
  expectedUpgradeIn: number | null
): string => {
  let percentage: number;

  if (expectedUpgradeIn !== null) {
    percentage = expectedUpgradeIn / avgCycle;
  } else {
    percentage = (avgCycle - releasedDaysAgo) / avgCycle;
  }

  if (percentage > 0.75) return 'Buy Now';
  if (percentage > 0.5) return 'Okay Buy';
  if (percentage > 0.25) return 'Wait';
  return "Don't Buy";
};

// CSS-in-JS styles for pagination controls
const paginationStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px',
  gap: '10px',
};

export default Page;




