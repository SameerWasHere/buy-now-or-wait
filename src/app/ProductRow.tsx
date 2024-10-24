// src/app/ProductRow.tsx
"use client";

import React from 'react';
import Image from 'next/image';

type ProductRowProps = {
  name: string;
  imageUrl: string | null;
  releasedDaysAgo: number;
  avgCycle: number;
  expectedUpgradeInDays: number | null;
  status: string;
};

const ProductRow: React.FC<ProductRowProps> = ({
  name,
  imageUrl,
  releasedDaysAgo,
  avgCycle,
  expectedUpgradeInDays,
  status,
}) => {
  return (
    <div style={rowContainerStyle}>
      {/* Product Name and Status Section */}
      <div style={nameAndStatusContainerStyle}>
        <h2 style={productNameStyle}>{name}</h2>
        <div style={statusButtonContainerStyle}>
          <button style={responsiveButtonStyle(status)}>{status}</button>
        </div>
      </div>
      <div style={rowStyles}>
        {/* Section 1: Product Image */}
        <div style={sectionStylesLeftAligned}>
          <Image
            src={imageUrl || '/default-image.jpg'}
            alt={name}
            width={200}
            height={200}
            style={imageStyles}
          />
        </div>

        {/* Section 2: Released Information */}
        <div style={sectionStylesInline}>
          <p style={responsiveInfoLabelStyle}>Released</p>
          <p style={{ ...infoValueStyle, color: getStatusColor(status) }}>{releasedDaysAgo}</p> {/* Matches status color */}
          <p style={responsiveInfoLabelStyle}>Days Ago</p>
        </div>

        {/* Section 3: Average Cycle */}
        <div style={sectionStylesInline}>
          <p style={responsiveInfoLabelStyle}>Average Cycle</p>
          <p style={{ ...infoValueStyle, color: 'black' }}>{avgCycle.toFixed(0)}</p> {/* Always black */}
          <p style={responsiveInfoLabelStyle}>Days</p>
        </div>

        {/* Section 4: Expected Upgrade In */}
        <div style={sectionStylesInline}>
          <p style={responsiveInfoLabelStyle}>Upgrade Expected</p>
          <p style={{ ...infoValueStyle, color: 'black' }}>
            {expectedUpgradeInDays !== null ? expectedUpgradeInDays : '-'}
          </p> {/* Always black */}
          <p style={responsiveInfoLabelStyle}>Days</p>
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS styles for light theme
const rowContainerStyle: React.CSSProperties = {
  marginBottom: '10px',
  backgroundColor: '#ffffff', // Set background to white
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow for elevation
  padding: '5px',
};

const nameAndStatusContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '8px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
};

const rowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'nowrap',
  padding: '5px 10px',
  overflowX: 'auto',
};

const sectionStylesLeftAligned: React.CSSProperties = {
  flex: '1 1 25%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  padding: '5px',
};

const sectionStylesInline: React.CSSProperties = {
  flex: '1 1 25%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '5px',
  gap: '1px',
};

const productNameStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: '0',
  color: '#333', // Darker text for visibility on light background
};

const imageStyles: React.CSSProperties = {
  objectFit: 'contain',
  alignSelf: 'flex-start',
};

const responsiveInfoLabelStyle: React.CSSProperties = {
  fontSize: 'clamp(0.6rem, 1.5vw, 1rem)',
  fontWeight: '500',
  color: '#555', // Darker label text for readability
  whiteSpace: 'nowrap',
};

const infoValueStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 5vw, 6rem)',
  fontWeight: 'bold',
  margin: '0',
  whiteSpace: 'nowrap',
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Buy Now':
      return '#39b54a';
    case 'Okay Buy':
      return '#b6d957';
    case 'Wait':
      return '#f7941d';
    case "Don't Buy":
      return '#ed1c24';
    default:
      return '#333'; // Default dark color for neutral status
  }
};

const responsiveButtonStyle = (status: string): React.CSSProperties => {
  const backgroundColor = getStatusColor(status);
  return {
    backgroundColor,
    color: 'white',
    padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)',
    fontSize: 'clamp(0.6rem, 1.2vw, 1rem)',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };
};

const statusButtonContainerStyle: React.CSSProperties = {
  marginLeft: '8px',
  display: 'flex',
  alignItems: 'center',
};

export default ProductRow;





