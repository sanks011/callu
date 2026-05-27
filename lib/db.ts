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

  // One-time migration: drop the unique mobile_1 index which breaks signup
  // when mobile is null (E11000 duplicate key). Mobile is optional so should not be unique.
  try {
    const usersCollection = mongoose.connection.db?.collection("users");
    if (usersCollection) {
      const indexes = await usersCollection.indexes();
      const hasMobileIndex = indexes.some((idx) => idx.name === "mobile_1");
      if (hasMobileIndex) {
        await usersCollection.dropIndex("mobile_1");
        console.log("[DB] ✓ Dropped legacy unique mobile_1 index");
      }
    }
  } catch (migrationErr: any) {
    // Non-fatal — log and continue
    console.warn("[DB] Could not drop mobile_1 index:", migrationErr?.message);
  }

  return mongoose.connection;
}

export default dbConnect;

