// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adminsight', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increase timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    
    // Log connection events
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to DB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from DB');
    });
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('📝 Connection string used:', process.env.MONGODB_URI);
    console.error('💡 Try:');
    console.error('   1. Check if MongoDB is running: mongod');
    console.error('   2. Try different connection string: mongodb://127.0.0.1:27017/adminsight');
    console.error('   3. Check MongoDB service status');
    process.exit(1);
  }
};

module.exports = connectDB;