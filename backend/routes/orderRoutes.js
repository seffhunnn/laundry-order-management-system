const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Order, PRICE_LIST, VALID_STATUSES } = require('../models/order');

// Helper to calculate estimated delivery date (+2 days from current date)
const calculateDeliveryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Helper to calculate total bill based on predefined price list
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    const price = PRICE_LIST[item.type] || 0;
    return sum + (price * item.quantity);
  }, 0);
};

// Middleware for basic validation of order creation
const validateOrderData = (req, res, next) => {
  const { customerName, phone, items } = req.body;

  if (!customerName || !phone || !items) {
    return res.status(400).json({ error: "Missing required fields: customerName, phone, or items" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items must be a non-empty list" });
  }

  for (const item of items) {
    if (!item.type || item.quantity === undefined) {
      return res.status(400).json({ error: "Each item must have a type and quantity" });
    }
    if (!PRICE_LIST[item.type]) {
      return res.status(400).json({ error: `Invalid item type: ${item.type}. Valid types are Shirt, Pants, Saree` });
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }
  }

  next();
};

// 1. Create Order (POST /orders)
router.post('/orders', validateOrderData, async (req, res) => {
  try {
    const { customerName, phone, items } = req.body;
    
    // Calculate bill automatically
    const totalAmount = calculateTotal(items);
    
    // Calculate delivery date (+2 days)
    const estimatedDelivery = calculateDeliveryDate();

    // Get sequential orderId by finding the maximum orderId in DB
    const lastOrder = await Order.findOne().sort({ orderId: -1 });
    const orderId = lastOrder ? lastOrder.orderId + 1 : 1;

    const newOrder = new Order({
      orderId,
      customerName,
      phone,
      items,
      totalAmount,
      status: 'RECEIVED',
      estimatedDeliveryDate: estimatedDelivery
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      orderId: newOrder.orderId,
      totalAmount: newOrder.totalAmount,
      estimatedDeliveryDate: newOrder.estimatedDeliveryDate,
      currency: "INR"
    });
  } catch (err) {
    res.status(500).json({ error: `Server error creating order: ${err.message}` });
  }
});

// 2. View Orders (GET /orders) with filtering
router.get('/orders', async (req, res) => {
  try {
    const { status, customerName, phone } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (customerName) {
      // Case-insensitive search on customer name
      query.customerName = { $regex: customerName, $options: 'i' };
    }
    if (phone) {
      query.phone = phone;
    }

    const orders = await Order.find(query).sort({ orderId: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: `Server error fetching orders: ${err.message}` });
  }
});

// 3. Update Order Status (PUT /orders/:id/status)
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderIdParam = req.params.id;

    if (!status) {
      return res.status(400).json({ error: "Status field is required" });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Valid: ${VALID_STATUSES.join(', ')}` });
    }

    // Try finding by custom numeric orderId first, then by MongoDB ObjectId as fallback
    let order = null;
    if (!isNaN(orderIdParam)) {
      order = await Order.findOne({ orderId: Number(orderIdParam) });
    }
    if (!order && mongoose.Types.ObjectId.isValid(orderIdParam)) {
      order = await Order.findById(orderIdParam);
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Status updated successfully",
      orderId: order.orderId,
      newStatus: order.status
    });
  } catch (err) {
    res.status(500).json({ error: `Server error updating order: ${err.message}` });
  }
});

// 4. Dashboard metrics (GET /dashboard)
router.get('/dashboard', async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Initialize counts for all statuses
    const statusCounts = {};
    VALID_STATUSES.forEach(status => {
      statusCounts[status] = 0;
    });

    orders.forEach(order => {
      if (statusCounts[order.status] !== undefined) {
        statusCounts[order.status]++;
      }
    });

    res.status(200).json({
      totalOrders,
      totalRevenue,
      statusCounts,
      currency: "INR"
    });
  } catch (err) {
    res.status(500).json({ error: `Server error generating dashboard: ${err.message}` });
  }
});

module.exports = router;
