const mongoose = require('mongoose');

// Price list configuration for different garment types
const PRICE_LIST = {
  "Shirt": 20,
  "Pants": 30,
  "Saree": 50
};

// List of allowed statuses
const VALID_STATUSES = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];

const OrderSchema = new mongoose.Schema({
  // Unique numeric identifier for the order (sequential ID)
  orderId: {
    type: Number,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  // Items array: Since 'type' is a reserved Mongoose schema keyword, 
  // we declare it as type: { type: String } so Mongoose knows it's a field named 'type'.
  items: [{
    type: {
      type: String,
      required: [true, 'Item type is required'],
      enum: Object.keys(PRICE_LIST)
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: VALID_STATUSES,
    default: 'RECEIVED'
  },
  estimatedDeliveryDate: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = {
  Order: mongoose.model('Order', OrderSchema),
  PRICE_LIST,
  VALID_STATUSES
};
