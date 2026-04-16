const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-guide-ai'
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`)
    console.warn('   Running without database — some features will be limited.\n')
    // Don't exit — allow app to serve frontend in production
  }
}

module.exports = connectDB
