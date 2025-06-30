import React, { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../utils/api';

const ServiceRequestPage = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);

  const [formData, setFormData] = useState({
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    contactNumber: '',
    description: ''
  });

  // Fetch service types
  const fetchServiceData = useCallback(async () => {
    try {
      const serviceRes = await apiRequest('/service-types');
      setServiceTypes(serviceRes.data || []);
    } catch (err) {
      setError('Failed to load service data');
    }
  }, []);

  // Fetch user's service requests
  const fetchUserRequests = useCallback(async () => {
    try {
      const res = await apiRequest('/service-requests/user');
      setServiceRequests(res.data || []);
    } catch (err) {
      setError('Failed to fetch your service requests');
    }
  }, []);

  useEffect(() => {
    fetchServiceData();
    fetchUserRequests();
  }, [fetchServiceData, fetchUserRequests]);

  const handleChange = useCallback((e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');
    try {
      await apiRequest('/service-requests', 'POST', formData);
      setSuccess('Service request submitted successfully!');
      setFormData({
        serviceType: '',
        preferredDate: '',
        preferredTime: '',
        contactNumber: '',
        description: ''
      });
      fetchUserRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [formData, fetchUserRequests]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Request a Service</h2>
        <p className="text-gray-600 text-center mb-8">Fill out the form to request a new service. You can also view your previous requests below.</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* New Request Form */}
          <div className="flex-1 bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">New Service Request</h3>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-4 rounded-md bg-green-50 p-3 text-green-700 text-sm">{success}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Service Type */}
                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                    Service Type *
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required
                  >
                    <option value="">Select Service Type</option>
                    {serviceTypes.map((service) => (
                      <option key={service._id} value={service.name}>
                        {service.name} - ₹{service.basePrice}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Your phone number"
                    required
                  />
                </div>

                {/* Preferred Date */}
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Preferred Time */}
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
                    Preferred Time *
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required
                  >
                    <option value="">Select Time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Service Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Please describe the issue or service you need..."
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>

          {/* Service Requests List */}
          <div className="flex-1 bg-white shadow rounded-lg p-6 mt-8 lg:mt-0">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Service Requests</h3>
            {serviceRequests.length === 0 ? (
              <div className="text-gray-500 text-center">You have not submitted any service requests yet.</div>
            ) : (
              <div className="space-y-4">
                {serviceRequests.map((request) => (
                  <div key={request._id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <div className="font-medium text-blue-700">{request.serviceType}</div>
                        <div className="text-sm text-gray-500">Preferred: {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : '-'} {request.preferredTime || ''}</div>
                        <div className="text-sm text-gray-500">Contact: {request.contactNumber}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold w-max ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2 text-gray-700 text-sm">{request.description}</div>
                    {request.statusHistory && request.statusHistory.length > 1 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span>Status history: </span>
                        {request.statusHistory.map((h, idx) => (
                          <span key={idx}>{h.status}{idx < request.statusHistory.length - 1 ? ', ' : ''}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ServiceRequestPage; 