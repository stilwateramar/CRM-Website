import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️  MONGO_URI not set; API will run but DB-backed routes will fail.');
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected');
  } catch (err: any) {
    console.error('\n❌ MongoDB connection failed:', err?.message || err);
    console.error(`
   The API will keep running, but DB-backed routes will return errors.
   To fix this, start MongoDB. Three easy options:

   1. Docker (fastest):
        docker run -d -p 27017:27017 --name yogify-mongo mongo:7

   2. Homebrew (Mac):
        brew tap mongodb/brew
        brew install mongodb-community
        brew services start mongodb-community

   3. MongoDB Atlas (free cloud):
        https://www.mongodb.com/atlas — create a free cluster,
        copy the connection string into backend/.env as MONGO_URI=...
`);
    mongoose.connection.on('error', () => {});
  }
}
