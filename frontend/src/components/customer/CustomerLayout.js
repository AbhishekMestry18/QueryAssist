import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

function CustomerLayout({ children }) {

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">Query Assist</h1>
          <div className="nav-links">
            <Link to="/customer/queries">My Queries</Link>
            <Link to="/customer/create">New Query</Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default CustomerLayout;

