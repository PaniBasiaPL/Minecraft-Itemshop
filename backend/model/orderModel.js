// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");

const order = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  itemId: {
    type: Number,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

module.exports = mongoose.model("Orders", order);
