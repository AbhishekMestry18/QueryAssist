# Query Assist - Audience Query Management & Response System

A unified MERN stack application for managing audience queries across multiple channels (email, social media, chat, community). The system features **two user types**: **Customers** who can submit queries and track their status, and **Company/Admin** users who manage all queries through a unified inbox.

## Features

### For Customers
✅ **Submit Queries** - Easy-to-use form to submit queries  
✅ **Track Status** - View all your submitted queries and their current status  
✅ **Query History** - See the complete activity history for each query  

### For Company/Admin
✅ **Unified Inbox** - Centralized view of all queries from all channels  
✅ **Auto-Tagging** - Automatically categorizes queries as question, request, complaint, feedback, or other  
✅ **Priority Detection** - Automatically detects and assigns priority (low, medium, high, urgent)  
✅ **Assignment & Tracking** - Assign queries to teams and track status through workflow  
✅ **Status Management** - Track queries through: new → assigned → in-progress → resolved → closed  
✅ **History Tracking** - Complete audit trail of all actions on each query  
✅ **Analytics Dashboard** - Comprehensive analytics on response times, query types, channels, and more  
✅ **Team Management** - Create and manage teams for query assignment  

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Context API
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with role-based access control
- **Styling**: CSS3 with modern, responsive design

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) - Make sure MongoDB is running on your system
- npm or yarn

## Installation & Setup

### 1. Clone or Navigate to the Project Directory

```bash
cd QueryAssist
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Set Up Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
copy .env.example .env
```

Edit the `.env` file and update if needed:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/queryassist
JWT_SECRET=your-secret-key-change-in-production
```

**Note:** Change `JWT_SECRET` to a secure random string in production.

### 4. Install Frontend Dependencies

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

### 5. Start MongoDB

Make sure MongoDB is running on your system. If you have MongoDB installed locally:

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or start it manually:
mongod
```

**Mac/Linux:**
```bash
# If installed via Homebrew:
brew services start mongodb-community
# Or:
mongod
```

## Running the Application

### Option 1: Run Backend and Frontend Separately (Recommended for Development)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

### Option 2: Run Backend in Production Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

## Usage Guide

### Customer Portal

1. **Register/Login** as a customer
2. **Submit a Query**:
   - Click "New Query"
   - Fill in channel, subject, and message
   - Submit - the system auto-tags and prioritizes
3. **View Your Queries**:
   - See all your submitted queries
   - Click any query to see details and status
   - Track activity history

### Admin Portal

1. **Login** with admin credentials
2. **Create Teams**:
   - Navigate to **Teams** from the navigation bar
   - Click **+ Add Team**
   - Fill in team name, email, and department
   - Click **Create Team**
3. **Manage Queries**:
   - View all queries in the **Unified Inbox**
   - Use filters to find specific queries by status, tag, priority, or channel
   - Click on any query to view details
   - In the query detail page:
     - **Assign** the query to a team
     - **Update status** (new → assigned → in-progress → resolved → closed)
     - View complete **history** of all actions
4. **View Analytics**:
   - Navigate to **Analytics** from the navigation bar
   - View comprehensive statistics including:
     - Total and resolved queries
     - Average response time
     - Distribution by query type, status, priority, and channel
     - Response time breakdown by query type

## Auto-Tagging Logic

The system automatically tags queries based on keywords:

- **Complaint**: complaint, disappointed, unhappy, poor, terrible, refund, cancel
- **Request**: request, please, need, want, require, order, purchase
- **Question**: ?, how, what, when, where, why, who, question, help, explain
- **Feedback**: feedback, suggestion, improve, recommend, review, opinion
- **Other**: Default for queries that don't match above categories

## Priority Detection Logic

Priority is automatically assigned based on:

- **Urgent**: Contains urgent keywords (urgent, asap, immediately, critical, emergency, broken, down)
- **High**: Complaints are automatically high priority
- **Medium**: Requests and default priority
- **Low**: Questions and feedback

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user (customer by default)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Queries (Requires Authentication)
- `GET /api/queries` - Get all queries (admin: all, customer: own only)
- `GET /api/queries/:id` - Get single query (admin: any, customer: own only)
- `POST /api/queries` - Create new query (all authenticated users)
- `PUT /api/queries/:id` - Update query (admin only)
- `DELETE /api/queries/:id` - Delete query (admin only)

### Teams (Admin Only)
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get single team
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Analytics (Admin Only)
- `GET /api/analytics` - Get comprehensive analytics data

**Note:** All endpoints except auth require JWT token in Authorization header: `Bearer <token>`

## Project Structure

```
QueryAssist/
├── backend/
│   ├── models/
│   │   ├── Query.js
│   │   └── Team.js
│   ├── routes/
│   │   ├── queries.js
│   │   ├── teams.js
│   │   └── analytics.js
│   ├── utils/
│   │   └── autoTagging.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Inbox.js
│   │   │   ├── QueryDetail.js
│   │   │   ├── CreateQuery.js
│   │   │   ├── Analytics.js
│   │   │   └── Teams.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Troubleshooting

### MongoDB Connection Error

If you see "MongoDB connection error":
1. Make sure MongoDB is installed and running
2. Check if the MongoDB URI in `.env` is correct
3. Try connecting to MongoDB using: `mongosh` or `mongo`

### Port Already in Use

If port 5000 or 3000 is already in use:
1. Change the PORT in backend `.env` file
2. Update the API_URL in frontend if needed
3. Or stop the process using that port

### CORS Errors

If you encounter CORS errors:
- Make sure the backend is running
- Check that the frontend proxy is set correctly in `package.json`

## Future Enhancements

Potential features to add:
- User authentication and authorization
- Email notifications
- Real-time updates using WebSockets
- Advanced search and filtering
- Export analytics to CSV/PDF
- Integration with actual email/social media APIs
- Multi-language support



