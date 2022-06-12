// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
require("mongoose-double")(mongoose);
var SchemaTypes = mongoose.Schema.Types;

const user = new mongoose.Schema({
  uuid: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  guild: {
    type: String,
    required: true,
  },
  rank: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    required: true,
  },
  ranking: {
    type: Number,
    required: true,
  },
  kills: {
    type: Number,
    required: true,
  },
  deaths: {
    type: Number,
    required: true,
  },
  mine_level: {
    type: Number,
    required: true,
  },
  refils: {
    type: Number,
    required: true,
  },
  enchanted_refils: {
    type: Number,
    required: true,
  },
  paid: {
    type: SchemaTypes.Double,
    required: true,
  },
  last_kills: [],
  last_deaths: [],
});

module.exports = mongoose.model("User", user);
