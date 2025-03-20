import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`Mongo db name: ${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDb Connected !! DB HOST ${connectionInstance}`);
  } catch (error) {
    console.log("MongoDB Connection Failed:", error);
  }
};

export default connectDb;
