// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");

const apikey = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("ApiKey", apikey, "apiKeys");
