// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");

const is = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  transfer: [],
  psc: [],
  sms: [],
});

module.exports = mongoose.model("ItemShop", is);
