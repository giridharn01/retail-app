const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder);

router.route('/:id')
    .get(protect, getOrder)
    .put(protect, authorize('admin'), updateOrderStatus);

router.put('/:id/cancel', protect, cancelOrder);

module.exports = router; 