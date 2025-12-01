import React, { useState } from 'react';
import { Download, X, Mail, Loader2 } from 'lucide-react';

const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

export default function DownloadReport() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });
  
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDownloadClick = () => {
    if (!filters.startDate || !filters.endDate) {
      setError('Please select both start and end dates');
      return;
    }
    
    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      setError('Start date must be before end date');
      return;
    }

    setError('');
    setShowModal(true);
  };

const handleDownload = async () => {
  const token = localStorage.getItem("token"); // <<< HERE

  if (!token) {
    setError("You are not authorized. Please log in again.");
    return;
  }

  if (!email) {
    setError('Please enter your email address');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('Please enter a valid email address');
    return;
  }

  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const queryParams = new URLSearchParams({
      status: 'approved',
      page: '1',
      startDate: filters.startDate,
      endDate: filters.endDate
    });

    const checkResponse = await fetch(
      `${baseURL}/api/v1/admin/applications?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // <<< ADD HERE
        }
      }
    );

    if (!checkResponse.ok) throw new Error('Failed to fetch applications');

    const downloadResponse = await fetch(
      `${baseURL}/api/v1/admin/download/application`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // <<< AND HERE
        },
        body: JSON.stringify({
          email,
          startDate: filters.startDate,
          endDate: filters.endDate
        })
      }
    );

    if (!downloadResponse.ok) {
      const errorData = await downloadResponse.json();
      throw new Error(errorData.message || 'Failed to request download');
    }

    await downloadResponse.json();
    setSuccess('Report request sent successfully! Check your email.');

    setTimeout(() => {
      setShowModal(false);
      setEmail('');
      setSuccess('');
    }, 3000);

  } catch (err) {
    setError(err.message || 'An error occurred while requesting the download');
  } finally {
    setLoading(false);
  }
};


  const closeModal = () => {
    setShowModal(false);
    setEmail('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8">
           Download Report
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 font-normal border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 font-normal border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownloadClick}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
          </div>

          {error && !showModal && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="text-green-700" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Download Report
              </h2>
              <p className="text-gray-600 font-normal
              \ text-sm">
                Enter your email address to receive the transaction report
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 font-semibold bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={loading}
                className="flex-1 px-4 py-2 font-normal border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={loading}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Download
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
