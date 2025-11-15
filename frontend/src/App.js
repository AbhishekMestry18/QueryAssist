import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import Inbox from './components/Inbox';
import Analytics from './components/Analytics';
import QueryDetail from './components/QueryDetail';
import Teams from './components/Teams';

// Customer components
import CustomerLayout from './components/customer/CustomerLayout';
import CustomerQueries from './components/customer/CustomerQueries';
import CreateCustomerQuery from './components/customer/CreateCustomerQuery';
import CustomerQueryDetail from './components/customer/CustomerQueryDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to admin inbox */}
        <Route path="/" element={<Navigate to="/admin/inbox" replace />} />
        
        {/* Admin routes - no authentication required */}
        <Route
          path="/admin/inbox"
          element={
            <AdminLayout>
              <Inbox />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <AdminLayout>
              <Teams />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/query/:id"
          element={
            <AdminLayout>
              <QueryDetail />
            </AdminLayout>
          }
        />
        
        {/* Customer routes - no authentication required */}
        <Route
          path="/customer/queries"
          element={
            <CustomerLayout>
              <CustomerQueries />
            </CustomerLayout>
          }
        />
        <Route
          path="/customer/create"
          element={
            <CustomerLayout>
              <CreateCustomerQuery />
            </CustomerLayout>
          }
        />
        <Route
          path="/customer/query/:id"
          element={
            <CustomerLayout>
              <CustomerQueryDetail />
            </CustomerLayout>
          }
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin/inbox" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

