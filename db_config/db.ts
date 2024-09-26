import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected.");
    });

    connection.on("error", (err) => {
      console.log("MongoDB connection error." + err);
    });
  } catch (err: any) {
    console.log("Error in connecting to database.");
    console.log(err);
  }
}
