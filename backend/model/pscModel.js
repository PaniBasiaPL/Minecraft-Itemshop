// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");

const payment = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("PendingPSCPayments", payment);
