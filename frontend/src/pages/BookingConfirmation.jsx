import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, movie, showtime, selectedSeats, email, phone, totalAmount } = location.state || {};

  if (!bookingId) {
    navigate('/');
    return null;
  }

  const bookingDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-red-600">BookMyShow</h1>
            <Button onClick={() => navigate('/')} variant="outline" size="sm">
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Your ticket has been booked successfully</p>
        </div>

        {/* Ticket Card */}
        <Card className="p-8 mb-6">
          <div className="border-b pb-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{movie.title}</h3>
                <p className="text-gray-600">{movie.genres.join(', ')}</p>
              </div>
              <img src={movie.poster} alt={movie.title} className="w-20 h-28 object-cover rounded" />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Booking ID</div>
              <div className="text-lg font-bold text-red-600">{bookingId}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">THEATER</h4>
              <p className="text-gray-900 font-medium">{showtime.theater.name}</p>
              <p className="text-sm text-gray-600">{showtime.theater.location}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">DATE & TIME</h4>
              <p className="text-gray-900 font-medium">{bookingDate}</p>
              <p className="text-sm text-gray-600">{showtime.time}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">SEATS</h4>
              <p className="text-gray-900 font-medium">{selectedSeats.join(', ')}</p>
              <p className="text-sm text-gray-600">{selectedSeats.length} Ticket(s)</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">FORMAT</h4>
              <p className="text-gray-900 font-medium">{showtime.format}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Amount Paid</span>
              <span className="text-2xl font-bold text-gray-900">₹{totalAmount}</span>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-900 font-medium">{email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Phone:</span>
              <span className="text-gray-900 font-medium">{phone}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              ✉️ A confirmation email with your ticket details has been sent to <strong>{email}</strong>
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 bg-red-600 hover:bg-red-700" size="lg">
            <Download className="h-5 w-5 mr-2" />
            Download Ticket
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Book More Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
