const express = require('express');
const router = express.Router();
const {
    getServiceRequests,
    getServiceRequest,
    createServiceRequest,
    updateServiceRequest,
    cancelServiceRequest
} = require('../controllers/services');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getServiceRequests)
    .post(protect, createServiceRequest);

router.route('/:id')
    .get(protect, getServiceRequest)
    .put(protect, authorize('admin'), updateServiceRequest);

router.put('/:id/cancel', protect, cancelServiceRequest);

module.exports = router; 