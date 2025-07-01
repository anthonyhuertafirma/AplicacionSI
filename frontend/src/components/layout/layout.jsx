import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </>
  );
};

export default Layout;