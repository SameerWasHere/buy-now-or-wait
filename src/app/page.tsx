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

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main
        style={{
          backgroundColor: '#f7f7f7', // Set a light background for the main content
          paddingTop: '80px', // Adjusted padding to account for header height
          paddingRight: '20px',
          paddingBottom: '20px',
          paddingLeft: '20px',
          minHeight: '100vh', // Ensure it covers full viewport height
        }}
      >
        {filteredProducts.map((product) => {
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

export default Page;


