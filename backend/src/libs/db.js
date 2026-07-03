import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("ConnectDB success");
  } catch (error) {
    console.error("ConnectDB error:", error);
    process.exit(1);
  }
};
