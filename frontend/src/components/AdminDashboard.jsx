import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, CheckCircle, XCircle } from 'lucide-react';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [facultyRequests, setFacultyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFacultyRequests();
  }, []);

  const fetchFacultyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/faculty-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFacultyRequests(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch faculty requests');
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/auth/approve-faculty/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchFacultyRequests();
    } catch (error) {
      setError('Failed to approve faculty request');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Faculty Approval Requests</h2>
            </div>
            
            <div className="border-t border-gray-200">
              {facultyRequests.length === 0 ? (
                <div className="px-4 py-5 sm:px-6 text-gray-500">
                  No pending faculty requests
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {facultyRequests.map((request) => (
                    <li key={request.request_id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.user.full_name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {request.user.email}
                          </p>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>Department: {request.department}</p>
                            <p>Designation: {request.designation}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(request.request_id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;