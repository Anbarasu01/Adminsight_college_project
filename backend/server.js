require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const fs = require('fs');
const path = require('path');

// Routers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const publicRoutes = require('./routes/publicRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const deptRoutes = require('./routes/deptRoutes');
const reportRoutes = require('./routes/reportRoutes');
const taskRoutes = require('./routes/taskRoutes');
const collectorRoutes = require('./routes/collectorRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Function to load models
const loadModels = () => {
  const modelsDir = path.join(__dirname, 'models');
  
  try {
    // Get all .js files in models directory
    const modelFiles = fs.readdirSync(modelsDir)
      .filter(file => file.endsWith('.js') && file !== 'index.js');
    
    // Load each model
    modelFiles.forEach(file => {
      try {
        require(path.join(modelsDir, file));
      } catch (error) {
        console.warn(`⚠️ Failed to load model ${file}:`, error.message);
      }
    });
    
  } catch (error) {
    console.error('❌ Error loading models:', error.message);
  }
};

// Load models after DB connection
mongoose.connection.once('open', async () => {
  console.log('✅ MongoDB connection established');
  
  // Load all models
  loadModels();
  
  // Check if PublicUser model exists
  if (mongoose.models.PublicUser) {
    console.log('✅ PublicUser model loaded');
    
    // Create collection if it doesn't exist
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      if (!collectionNames.includes('publicusers')) {
        console.log('📝 Creating publicusers collection...');
        await mongoose.connection.db.createCollection('publicusers');
        console.log('✅ Created publicusers collection');
      }
    } catch (error) {
      console.error('❌ Error checking/creating collections:', error.message);
    }
  }
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Health check with DB status
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbStatus] || 'unknown';
  
  res.status(200).json({ 
    success: true, 
    message: 'AdminInsight API is running', 
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusText,
      connected: dbStatus === 1,
      models: mongoose.models ? Object.keys(mongoose.models) : []
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/collector', collectorRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AdminInsight Backend API', 
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

module.exports = server;