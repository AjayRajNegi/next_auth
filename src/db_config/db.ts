//Setting up connection to mongoDB database using mongoose.
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
export async function connect() {
  //Get the current state of the MongoDB connection.
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected.");
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting.....");
    return;
  }
  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "next_auth",
      //Mongoose will queue the commands and run them when the connection is established.
      bufferCommands: true,
    });
    console.log("Connection to database is established.");
  } catch (error: any) {}
}
