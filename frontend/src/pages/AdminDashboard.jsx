import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, Users, Film, Building2, DollarSign, Calendar } from 'lucide-react';
import { Card } from '../components/ui/card';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API}/admin/analytics`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                TicketHub Admin
              </h1>
              <span className="text-gray-400">Dashboard</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-red-600 to-red-700 border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Revenue</p>
                <h3 className="text-3xl font-bold text-white mt-2">
                  ₹{analytics?.total_revenue?.toLocaleString() || 0}
                </h3>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-600 to-green-700 border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Bookings</p>
                <h3 className="text-3xl font-bold text-white mt-2">
                  {analytics?.total_bookings?.toLocaleString() || 0}
                </h3>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Avg Booking Value</p>
                <h3 className="text-3xl font-bold text-white mt-2">
                  ₹{analytics?.total_bookings > 0 
                    ? Math.round(analytics.total_revenue / analytics.total_bookings)
                    : 0}
                </h3>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Movies */}
          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex items-center space-x-3 mb-6">
              <Film className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold text-white">Most Popular Movies</h2>
            </div>
            <div className="space-y-4">
              {analytics?.popular_movies?.length > 0 ? (
                analytics.popular_movies.map((movie, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{movie.title}</h3>
                        <p className="text-sm text-gray-400">{movie.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-500 font-semibold">₹{movie.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">revenue</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">No bookings yet</div>
              )}
            </div>
          </Card>

          {/* Busiest Theaters */}
          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-white">Busiest Theaters</h2>
            </div>
            <div className="space-y-4">
              {analytics?.busiest_theaters?.length > 0 ? (
                analytics.busiest_theaters.map((theater, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{theater.name}</h3>
                        <p className="text-sm text-gray-400">{theater.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="h-16 w-16 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">No bookings yet</div>
              )}
            </div>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700/50 mt-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Real-time Analytics</h3>
              <p className="text-purple-200 text-sm">
                This dashboard shows real-time booking data, revenue metrics, and theater performance. 
                Data updates automatically as new bookings are made through the platform.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
