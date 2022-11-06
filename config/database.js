const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //Plugging in DB string directly was only way to get heroku host to work
    const conn = await mongoose.connect("mongodb+srv://my:movies@cluster0.lwcydqx.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
