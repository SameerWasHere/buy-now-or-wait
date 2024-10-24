// src/app/Header.tsx
"use client";

import React from 'react';

type HeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <header style={headerStyles}>
      <h1 style={titleStyles}>Buy Now or Later</h1>
      <div style={searchContainerStyles}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a product..."
          style={searchInputStyles}
        />
      </div>
    </header>
  );
};

const headerStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  backgroundColor: 'rgba(16, 16, 16, 0.8)', // Darker grey with transparency
  color: 'white',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // Aligns title and search bar inline
  zIndex: 1000, // Ensure it stays above other elements
};

const titleStyles: React.CSSProperties = {
  margin: 0,
  fontSize: '1.5rem',
};

const searchContainerStyles: React.CSSProperties = {
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'flex-end',
};

const searchInputStyles: React.CSSProperties = {
  width: '50%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  color: 'black',
  backgroundColor: 'white',
};

export default Header;


