const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  line1: {
    type: String,
    required: true,
    maxlength: 150,
  },
  line2: {
    type: String,
    maxlength: 150,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  postalcode: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Address", addressSchema);
