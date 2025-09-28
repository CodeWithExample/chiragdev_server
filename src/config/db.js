import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb+srv://chiragDev_server:19vhKvOMNSPdSTWX@cluster0.kbcbe2r.mongodb.net');
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
