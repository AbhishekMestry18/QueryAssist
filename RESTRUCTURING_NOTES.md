# Restructuring Notes - Two User System

## Overview

The application has been restructured to support two distinct user types:

1. **Customers** - Can submit queries and view their own queries
2. **Company/Admin** - Full access to manage all queries, teams, and analytics

## Key Changes

### Backend Changes

1. **Authentication System**
   - Added User model with roles (customer, admin)
   - JWT-based authentication
   - Password hashing with bcrypt
   - Role-based middleware for route protection

2. **Query Model Updates**
   - Added `createdBy` field to link queries to users
   - Customers can only see/modify their own queries
   - Admins can see and manage all queries

3. **Route Protection**
   - All query routes require authentication
   - Customer routes filter by `createdBy`
   - Admin-only routes for teams, analytics, and query updates

### Frontend Changes

1. **Authentication Context**
   - Created `AuthContext` for global auth state
   - Token management in localStorage
   - Automatic token refresh on page load

2. **Separate Portals**
   - **Customer Portal**: `/customer/*` routes
     - My Queries view
     - Create Query form
     - Query detail view
   - **Admin Portal**: `/admin/*` routes
     - Unified Inbox (all queries)
     - Analytics Dashboard
     - Team Management
     - Query Management

3. **Protected Routes**
   - `ProtectedRoute` component enforces authentication
   - Role-based access control
   - Automatic redirects based on user role

4. **Login/Register Pages**
   - Public authentication pages
   - Role-based redirects after login
   - Customer registration flow

## User Flows

### Customer Flow
1. Register/Login → Customer Portal
2. Submit Query → Auto-tagged and prioritized
3. View Queries → See all own queries with status
4. Query Details → View status, history, and updates

### Admin Flow
1. Login → Admin Portal
2. Unified Inbox → See all queries from all customers
3. Assign & Manage → Assign to teams, update status
4. Analytics → View comprehensive statistics
5. Teams → Manage team members

## Security Features

- JWT tokens with 7-day expiration
- Password hashing (bcrypt)
- Role-based access control
- Route-level protection
- Customer data isolation

## Migration Notes

- Existing queries will have `createdBy: null` (legacy)
- New queries automatically link to creator
- Admin can still manage all queries regardless of creator
- Customers can only access their own queries

## Testing

1. **Create Admin User:**
   ```bash
   cd backend
   npm run create-admin
   ```

2. **Test Customer Flow:**
   - Register new customer account
   - Submit queries
   - View own queries

3. **Test Admin Flow:**
   - Login as admin
   - View all queries in inbox
   - Assign and manage queries
   - View analytics

## Future Enhancements

- Email notifications for query status changes
- Customer can reply to queries
- Admin can respond to customer queries
- Query templates
- Bulk operations for admins
- Advanced search and filtering


