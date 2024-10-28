"use client";

import React, { useEffect, useState } from 'react';
import ProductRow from '@/app/ProductRow';
import { useParams } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  group: string;
  image_url: string | null;
  release_date: string | null;
  expected_date: string | null;
  avg_cycle: number | null;
  upgraded_after: number | null;
};

const GroupPage: React.FC = () => {
  const params = useParams();
  const groupParam = params?.group;

  // Decode the group parameter to handle spaces
  const group = Array.isArray(groupParam) ? decodeURIComponent(groupParam[0]) : decodeURIComponent(groupParam || '');

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [maxUpgradeAfter, setMaxUpgradeAfter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (group) {
      // Fetch products for the group from the API
      fetch(`/api/products?group=${encodeURIComponent(group)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data: Product[]) => {
          // Filter products belonging to the same group
          const groupProducts = data.filter((product) => product.group === group);

          // Find the product with non-null avg_cycle for the main row
          const productWithAvgCycle = groupProducts.find((product) => product.avg_cycle !== null);
          if (productWithAvgCycle) {
            setCurrentProduct(productWithAvgCycle);
          }

          // Filter products with non-null upgraded_after for bars
          const productsWithUpgradedAfter = groupProducts.filter((product) => product.upgraded_after !== null);

          if (productsWithUpgradedAfter.length > 0) {
            // Sort by release_date (newest to oldest)
            const sortedProducts = productsWithUpgradedAfter.sort(
              (a, b) => new Date(b.release_date!).getTime() - new Date(a.release_date!).getTime()
            );

            setRelatedProducts(sortedProducts);

            // Set max upgraded_after for the progress bar calculation
            const maxUpgrade = Math.max(...sortedProducts.map((product) => product.upgraded_after || 0));
            setMaxUpgradeAfter(maxUpgrade);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching product data:', error);
          setLoading(false);
        });
    }
  }, [group]);

  if (loading) return <div>Loading...</div>;

  if (!currentProduct) return <div>No main product found for this group.</div>;

  return (
    <div style={groupPageStyles}>
      <h1 style={responsiveHeaderStyles}>Should you buy {group} now or wait?</h1>

      {/* Display the current product row */}
      <ProductRow
        name={currentProduct.name}
        imageUrl={currentProduct.image_url}
        releasedDaysAgo={calculateReleasedDaysAgo(currentProduct.release_date)}
        avgCycle={currentProduct.avg_cycle || 0}
        expectedUpgradeInDays={calculateExpectedUpgradeInDays(currentProduct.expected_date)}
        status={calculateStatus(
          calculateReleasedDaysAgo(currentProduct.release_date),
          currentProduct.avg_cycle || 0,
          calculateExpectedUpgradeInDays(currentProduct.expected_date)
        )}
        group={currentProduct.group}
        overrideTextColor="black"
      />

      {/* Display related products with upgraded_after bars */}
      <div style={productListStyles}>
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <div key={product.id} style={productItemStyles}>
              {/* Product Name Container */}
              <div style={productNameContainerStyles}>
                <span style={productNameStyles}>{product.name}</span>
              </div>

              {/* Progress Bar Container */}
              <div style={progressBarContainerStyles}>
                <div style={upgradeBarBackgroundStyles}>
                  <div
                    style={{
                      ...upgradeBarStyles,
                      width: `${(product.upgraded_after! / maxUpgradeAfter) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Upgraded After Info Container */}
              <div style={upgradeInfoContainerStyles}>
                <span style={upgradeLabelStyles}>upgraded after</span>
                <span style={upgradeNumberStyles}>{product.upgraded_after}</span>
                <span style={upgradeLabelStyles}>days</span>
              </div>
            </div>
          ))
        ) : (
          <p>No related products with upgrade info found in this group.</p>
        )}
      </div>
    </div>
  );
};

// Helper functions for calculations
const calculateReleasedDaysAgo = (releaseDate: string | null): number => {
  if (!releaseDate) return 0;
  const release = new Date(releaseDate);
  const today = new Date();
  return Math.floor((today.getTime() - release.getTime()) / (1000 * 60 * 60 * 24));
};

const calculateExpectedUpgradeInDays = (expectedDate: string | null): number | null => {
  if (!expectedDate) return null;
  const today = new Date();
  const expected = new Date(expectedDate);
  const daysUntilUpgrade = Math.floor((expected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilUpgrade >= 0 ? daysUntilUpgrade : null;
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

// CSS-in-JS styles
const groupPageStyles: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f7f7f7',
  minHeight: '100vh',
};

const responsiveHeaderStyles: React.CSSProperties = {
  fontSize: 'clamp(0.8rem, 4.2vw, 2.5rem)',
  fontWeight: 'bold',
  color: 'black',
  marginBottom: '20px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  paddingLeft: '1px',
  paddingRight: '1px',
};

const productListStyles: React.CSSProperties = {
  marginTop: '30px',
};

const productItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #ccc',
  gap: '10px',
};

const productNameContainerStyles: React.CSSProperties = {
  flex: '1 1 15%',
  maxWidth: '150px', // Limit max width to avoid excessive spacing
  minWidth: '100px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

const progressBarContainerStyles: React.CSSProperties = {
  flex: '2 1 70%', // Adjust flex to take up more space
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

const productNameStyles: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: 'clamp(0.8rem, 1.2vw, 1.2rem)',
  color: 'black',
};

const upgradeInfoContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '2px',
  minWidth: '80px',
};

const upgradeLabelStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#555',
};

const upgradeNumberStyles: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '1rem',
  color: 'black',
};

const upgradeBarBackgroundStyles: React.CSSProperties = {
  width: '100%',
  height: '10px',
  backgroundColor: '#e0e0e0',
  borderRadius: '5px',
  overflow: 'hidden',
};

const upgradeBarStyles: React.CSSProperties = {
  height: '10px',
  backgroundColor: '#4caf50',
};

export default GroupPage;


































