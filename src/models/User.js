const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: { type: String, maxLength: 255 },
    email: { type: String, maxLength: 255, required: true,unique: true },
    password: { type: String, maxLength: 255 },
    isAdmin: { type: Boolean, default: false},
    phone: { type: String },
    address: { type: String },
    avatar: { type: String },
    city: { type: String },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('User', UserSchema);