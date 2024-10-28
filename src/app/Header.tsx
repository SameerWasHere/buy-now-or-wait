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
  fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', // Responsive font size
  whiteSpace: 'nowrap',
  flexShrink: 0, // Prevents shrinking of the title
};

const searchContainerStyles: React.CSSProperties = {
  flexGrow: 1, // Allows the search bar to grow and fill available space
  display: 'flex',
  justifyContent: 'flex-end',
  marginLeft: '10px', // Space between title and search bar
};

const searchInputStyles: React.CSSProperties = {
  width: '100%', // Takes full available width
  maxWidth: '400px', // Limits max width for better layout
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  color: 'black',
  backgroundColor: 'white',
};

export default Header;


