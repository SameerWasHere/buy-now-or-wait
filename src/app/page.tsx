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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const RESULTS_PER_PAGE = 10;

  // Fetch all products from API and set available brands/types
  useEffect(() => {
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => {
        // Filter products with non-null avg_cycle
        const filteredProducts = data.filter((product: Product) => product.avg_cycle !== null);
        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Filter products based on search term, selected brands, and selected types
  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type);

    return matchesSearchTerm && matchesBrand && matchesType;
  });

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

  // Function to apply filters and reset pagination
  const applyFilters = () => {
    setCurrentPage(1);
  };

  const calculateReleasedDaysAgo = (releaseDate: string | null): number => {
    if (!releaseDate) return 0;
    const release = new Date(releaseDate);
    const today = new Date();
    return Math.floor((today.getTime() - release.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        brands={[...new Set(products.map((product) => product.brand))]} // Extract unique brands
        types={[...new Set(products.map((product) => product.type))]} // Extract unique types
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        applyFilters={applyFilters}
      />
      <main
        style={{
          backgroundColor: '#f7f7f7',
          paddingTop: '120px', // Increased to accommodate filter dropdowns
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
              group={product.group}
            />
          );
        })}

        {/* Pagination Controls */}
        <div style={paginationStyles}>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            style={currentPage === 1 ? disabledButtonStyles : buttonStyles}
          >
            Previous
          </button>
          <span style={textStyles}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            style={currentPage === totalPages ? disabledButtonStyles : buttonStyles}
          >
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

  if (percentage > 0.75) return 'Buy That Today';
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

const buttonStyles: React.CSSProperties = {
  backgroundColor: '#e0e0e0',
  color: 'black',
  padding: '5px 10px', // Reduced vertical padding for narrower height
  border: '1px solid #ccc',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1rem',
};

const disabledButtonStyles: React.CSSProperties = {
  ...buttonStyles,
  backgroundColor: '#ccc',
  color: '#666',
  cursor: 'not-allowed',
};

const textStyles: React.CSSProperties = {
  color: 'black',
  fontSize: '1rem',
};

export default Page;






