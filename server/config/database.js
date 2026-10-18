import mongoose from 'mongoose';
import dns from 'dns';
import { ENV } from './env.js';

// Resolve DNS SRV issues on Windows by utilizing reliable public DNS resolvers
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // If setting custom DNS fails in restricted sandbox, proceed with default
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return true;
  }

  const mongoUri = ENV.MONGODB_URI || 'mongodb://127.0.0.1:27017/viya_library';

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });

    isConnected = true;
    console.log(`===============================================`);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    console.log(`===============================================`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`===============================================`);
    console.warn(`⚠️  MongoDB Connection Warning:`);
    console.warn(`   Could not connect to MongoDB at "${mongoUri}".`);
    console.warn(`   Error: ${error.message}`);
    console.warn(`👉 Note:`);
    console.warn(`   If IP is not whitelisted in Atlas, add "0.0.0.0/0" in MongoDB Atlas Network Access.`);
    console.warn(`   Falling back to persistent local JSON store for uninterrupted operation.`);
    console.warn(`===============================================`);
    return false;
  }
};

export const isMongoConnected = () => isConnected;

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('🍃 MongoDB disconnected.');
});
