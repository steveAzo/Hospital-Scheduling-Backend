const mongoose = require('mongoose')

require('dotenv').config()

MONGO_URI = process.env.MONGO_URI

const connectToDatabase = async () => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("Database connected successfully");
    } catch (error) {
      console.error(`Error connecting to database: ${error.message}`);
      process.exit(1); 
    }
  };
  
module.exports = connectToDatabase;
  