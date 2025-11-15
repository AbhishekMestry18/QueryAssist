# Quick Start Guide

## Prerequisites Check
- ✅ Node.js installed (check with: `node --version`)
- ✅ MongoDB installed and running (check with: `mongosh` or `mongo`)

## Step-by-Step Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Setup Backend Environment
```bash
# Copy the example env file
copy .env.example .env
# (On Mac/Linux: cp .env.example .env)
```

Edit `.env` if your MongoDB is not on localhost:27017

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Start MongoDB
Make sure MongoDB is running. If not:
- **Windows**: Start MongoDB service or run `mongod`
- **Mac/Linux**: `brew services start mongodb-community` or `mongod`

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will open automatically on http://localhost:3000

## First Steps After Launch

1. **Create Teams**: Go to "Teams" → Add your first team
2. **Create a Query**: Go to "New Query" → Create a test query
3. **View Inbox**: See your query in the unified inbox
4. **Assign & Manage**: Click on the query to assign it and update status
5. **View Analytics**: Check the Analytics page for insights

## Test Queries to Try

Try creating queries with different content to see auto-tagging in action:

- **Complaint**: "I'm very disappointed with your service. I want a refund immediately!"
- **Request**: "I need help with my order. Please process my purchase."
- **Question**: "How do I reset my password? Can you help me?"
- **Feedback**: "I have a suggestion to improve your product. Here's my review."

## Troubleshooting

**MongoDB not connecting?**
- Check if MongoDB is running: `mongosh`
- Verify connection string in `.env` file

**Port already in use?**
- Change PORT in backend `.env`
- Or kill the process using that port

**Dependencies not installing?**
- Make sure you have Node.js v14+
- Try deleting `node_modules` and `package-lock.json`, then `npm install` again

