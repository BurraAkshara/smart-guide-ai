// MongoDB initialisation script
// Runs once when the container first starts
db = db.getSiblingDB('smart-guide-ai')

db.createCollection('users')
db.createCollection('services')
db.createCollection('applications')

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.services.createIndex({ slug: 1 }, { unique: true })
db.services.createIndex({ category: 1 })
db.applications.createIndex({ user: 1 })
db.applications.createIndex({ status: 1 })

print('✅ MongoDB initialized: smart-guide-ai database ready')
