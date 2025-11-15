import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

function AdminLayout({ children }) {

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">Query Assist - Admin</h1>
          <div className="nav-links">
            <Link to="/admin/inbox">Unified Inbox</Link>
            <Link to="/admin/analytics">Analytics</Link>
            <Link to="/admin/teams">Teams</Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;

