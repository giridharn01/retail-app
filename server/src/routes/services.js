const express = require('express');
const router = express.Router();
const {
    getServiceRequests,
    getServiceRequest,
    createServiceRequest,
    updateServiceRequest,
    cancelServiceRequest,
    deleteServiceRequest
} = require('../controllers/services');
const { protect, authorize } = require('../middleware/auth');
const ServiceRequest = require('../models/ServiceRequest');

router.route('/')
    .get(protect, getServiceRequests)
    .post(protect, createServiceRequest);

// Get service requests for current user only
router.get('/user', protect, async (req, res) => {
    try {
        const serviceRequests = await ServiceRequest.find({ user: req.user.id })
            .populate('user', 'name email')
            .populate('technician', 'name email');

        res.json({
            success: true,
            count: serviceRequests.length,
            data: serviceRequests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.route('/:id')
    .get(protect, getServiceRequest)
    .put(protect, authorize('admin'), updateServiceRequest);

router.put('/:id/cancel', protect, cancelServiceRequest);

router.delete('/:id', protect, authorize('admin'), deleteServiceRequest);

module.exports = router; 