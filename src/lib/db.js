import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI .env file me defined nahi hai");
}

let cached = global.mongoose || { conn: null, promise: null };

// Dono naam export kar rahe hain taaki koi error na aaye
export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export async function dbConnect() {
  return connectDB();
}

export default connectDB;