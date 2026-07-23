require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Log = require('./models/Log');

const app = express();

// Middleware
app.use(cors());
// Need a larger limit for bulk uploads (10,000 records)
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const connectDB = async () => {
  let MONGO_URI = process.env.MONGO_URI;

  // Fallback to in-memory database if no URI is provided
  if (!MONGO_URI) {
    console.log("No MONGO_URI found in env. Starting In-Memory MongoDB for local testing...");
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    MONGO_URI = mongoServer.getUri();
  }

  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected to', MONGO_URI))
    .catch(err => console.error('MongoDB connection error:', err));
};

connectDB();
// Routes

// 1. Bulk Upload API
app.post('/api/logs/bulk', async (req, res) => {
  try {
    const logs = req.body;
    if (!Array.isArray(logs)) {
      return res.status(400).json({ error: 'Expected an array of logs' });
    }
    
    // Insert logs using insertMany for efficiency
    await Log.insertMany(logs);
    res.status(201).json({ message: `Successfully inserted ${logs.length} logs.` });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Internal server error during bulk upload.' });
  }
});

// 2. Fetch Logs API (Pagination, Sorting, Filtering)
app.get('/api/logs', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search = '',
      severity,
      role,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filtering logic
    if (search) {
      // Searching by actor (email) or resource
      query.$or = [
        { actor: { $regex: search, $options: 'i' } },
        { resource: { $regex: search, $options: 'i' } }
      ];
    }
    if (severity && severity !== 'All') {
      query.severity = severity;
    }
    if (role && role !== 'All') {
      query.role = role;
    }

    // Pagination setup
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting setup
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query
    const logs = await Log.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination math on frontend
    const totalRecords = await Log.countDocuments(query);

    res.status(200).json({
      logs,
      totalRecords,
      currentPage: pageNum,
      totalPages: Math.ceil(totalRecords / limitNum)
    });

  } catch (error) {
    console.error('Fetch logs error:', error);
    res.status(500).json({ error: 'Internal server error while fetching logs.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
