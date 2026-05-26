import mongoose from 'mongoose';

// These imports ensure models are registered when dbConnect is called
import '@/models/User';
import '@/models/Room';
import '@/models/CallLog';

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // Reuse an active connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Disconnect any stale/connecting/disconnecting state before reconnecting
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Always connect using the URI from process.env — never from cache
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  return mongoose.connection;
}

export default dbConnect;

