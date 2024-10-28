 // src/app/ProductRow.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type ProductRowProps = {
  name: string;
  imageUrl: string | null;
  releasedDaysAgo: number;
  avgCycle: number;
  expectedUpgradeInDays: number | null;
  status: string;
  group: string;
  overrideTextColor?: string; // Optional prop for custom text color
};

const ProductRow: React.FC<ProductRowProps> = ({
  name,
  imageUrl,
  releasedDaysAgo,
  avgCycle,
  expectedUpgradeInDays,
  status,
  group,
  overrideTextColor = '#333', // Default to dark grey
}) => {
  const router = useRouter();

  // Handle row click
  const handleRowClick = () => {
    router.push(`/group/${encodeURIComponent(group)}`);
  };

  // Determine color based on status
  const statusColor = getStatusColor(status);

  return (
    <div style={rowContainerStyle} onClick={handleRowClick}>
      {/* Product Name and Status Section */}
      <div style={nameAndStatusContainerStyle}>
        <h2 style={{ ...productNameStyle, color: overrideTextColor }}>{name}</h2>
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
          <p style={{ ...infoValueStyle, color: statusColor }}>{releasedDaysAgo}</p>
          <p style={responsiveInfoLabelStyle}>Days Ago</p>
        </div>

        {/* Section 3: Average Cycle */}
        <div style={sectionStylesInline}>
          <p style={responsiveInfoLabelStyle}>Average Cycle</p>
          <p style={{ ...infoValueStyle, color: overrideTextColor }}>{avgCycle.toFixed(0)}</p>
          <p style={responsiveInfoLabelStyle}>Days</p>
        </div>

        {/* Section 4: Expected Upgrade In */}
        <div style={sectionStylesInline}>
          <p style={responsiveInfoLabelStyle}>Upgrade Expected</p>
          <p style={{ ...infoValueStyle, color: overrideTextColor }}>
            {expectedUpgradeInDays !== null ? expectedUpgradeInDays : '-'}
          </p>
          <p style={responsiveInfoLabelStyle}>Days</p>
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS styles for light theme
const rowContainerStyle: React.CSSProperties = {
  marginBottom: '10px',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
};

const imageStyles: React.CSSProperties = {
  objectFit: 'contain',
  alignSelf: 'flex-start',
};

const responsiveInfoLabelStyle: React.CSSProperties = {
  fontSize: 'clamp(0.6rem, 1.5vw, 1rem)',
  fontWeight: '500',
  color: '#555',
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
      return '#333';
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







