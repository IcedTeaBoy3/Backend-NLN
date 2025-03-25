const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    name: { type: String, maxLength: 255, required: true, unique: true },
    type: { type: String, maxLength: 255, required: true},
    price: { type: Number, required: true},
    countInStock: { type: Number, required: true},
    rating: { type: Number, required:true },
    description: { type: String, maxLength: 600},
    image: { type: String, required: true},
    discount: { type: Number},
    selled: { type: Number},
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('Product', ProductSchema);