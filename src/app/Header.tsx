// src/app/Header.tsx
"use client";

import React, { useState } from 'react';

type HeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  brands: string[];
  types: string[];
  selectedBrands: string[];
  selectedTypes: string[];
  setSelectedBrands: (brands: string[]) => void;
  setSelectedTypes: (types: string[]) => void;
};

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  brands,
  types,
  selectedBrands,
  selectedTypes,
  setSelectedBrands,
  setSelectedTypes,
}) => {
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleBrandFilter = () => {
    setShowBrandFilter(!showBrandFilter);
    if (showTypeFilter) setShowTypeFilter(false);
  };

  const toggleTypeFilter = () => {
    setShowTypeFilter(!showTypeFilter);
    if (showBrandFilter) setShowBrandFilter(false);
  };

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <header style={headerStyles}>
      <div style={headerContentStyles}>
        <h1 style={titleStyles}>Should I Buy That Today?</h1>
        <div style={searchContainerStyles}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for a product..."
            style={searchInputStyles}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={filterButtonContainerStyles}>
        <button style={filterButtonStyles} onClick={toggleBrandFilter}>
          {showBrandFilter ? 'Close' : 'Filter Brand'}
        </button>
        <button style={filterButtonStyles} onClick={toggleTypeFilter}>
          {showTypeFilter ? 'Close' : 'Filter Type'}
        </button>
      </div>

      {/* Brand Filter Dropdown */}
      {showBrandFilter && (
        <div style={filterDropdownStyles}>
          <h3 style={filterTitleStyles}>Select Brands</h3>
          {brands.map((brand) => (
            <div
              key={brand}
              style={filterOptionStyles}
              onClick={() => handleBrandChange(brand)}
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                style={checkboxStyles}
              />
              <label style={filterLabelStyles}>{brand}</label>
            </div>
          ))}
        </div>
      )}

      {/* Type Filter Dropdown */}
      {showTypeFilter && (
        <div style={filterDropdownStyles}>
          <h3 style={filterTitleStyles}>Select Types</h3>
          {types.map((type) => (
            <div
              key={type}
              style={filterOptionStyles}
              onClick={() => handleTypeChange(type)}
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                style={checkboxStyles}
              />
              <label style={filterLabelStyles}>{type}</label>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

// CSS-in-JS styles for the Header
const headerStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  backgroundColor: 'rgba(16, 16, 16, 0.9)',
  color: 'white',
  padding: '10px 20px',
  zIndex: 1000,
};

const headerContentStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const titleStyles: React.CSSProperties = {
  margin: 5,
  fontSize: 'clamp(.75rem, 3vw, 1.5rem)',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const searchContainerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
};

const searchInputStyles: React.CSSProperties = {
  flex: 1,
  maxWidth: '600px',
  height: '30px',
  padding: '5px 10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  color: 'black',
  backgroundColor: 'white',
};

const filterButtonContainerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '10px',
  gap: '10px',
};

const filterButtonStyles: React.CSSProperties = {
  padding: '4px 10px',
  backgroundColor: 'rgba(16, 16, 16, 0.9)',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

const filterDropdownStyles: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: 'rgba(16, 16, 16, 0.9)',
  color: 'white',
  padding: '20px',
  zIndex: 999,
  maxHeight: '300px',
  overflowY: 'auto',
};

const filterTitleStyles: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
};

const filterOptionStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '5px',
  cursor: 'pointer',
};

const filterLabelStyles: React.CSSProperties = {
  marginLeft: '10px',
  color: 'white',
  cursor: 'pointer',
};

const checkboxStyles: React.CSSProperties = {
  width: '20px',
  height: '20px',
  accentColor: '#fff',
  cursor: 'pointer',
  WebkitAppearance: 'checkbox', // Ensures visibility on iOS
  appearance: 'checkbox', // Ensures visibility on modern browsers
};

export default Header;









