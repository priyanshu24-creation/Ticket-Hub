import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from '../hooks/use-toast';

const Payment = () => {
  const { movieId, showtimeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSeats, movie, showtime } = location.state || {};
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!selectedSeats || !movie || !showtime) {
    navigate('/');
    return null;
  }

  const totalPrice = selectedSeats.length * showtime.price;
  const convenienceFee = Math.round(selectedSeats.length * 20);
  const grandTotal = totalPrice + convenienceFee;

  const handlePayment = async () => {
    if (!email || !phone) {
      toast({
        title: "Missing information",
        description: "Please enter your email and phone number.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      setProcessing(false);
      navigate('/booking-confirmation', {
        state: {
          bookingId: `BMS${Date.now()}`,
          movie,
          showtime,
          selectedSeats,
          email,
          phone,
          totalAmount: grandTotal
        }
      });
      toast({
        title: "Payment Successful!",
        description: "Your tickets have been booked successfully."
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-red-600">BookMyShow</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ticket will be sent to this email</p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <button className="w-full p-4 border-2 border-red-600 bg-red-50 rounded-lg text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">Razorpay Payment Gateway</div>
                      <div className="text-sm text-gray-600">UPI, Cards, NetBanking, Wallets</div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </button>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-3">
                  <img src={movie.poster} alt={movie.title} className="w-16 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{movie.title}</h4>
                    <p className="text-xs text-gray-600">{showtime.theater.name}</p>
                    <p className="text-xs text-gray-600">{showtime.time}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tickets ({selectedSeats.length}):</span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Convenience Fee:</span>
                  <span className="font-medium">₹{convenienceFee}</span>
                </div>
              </div>

              <div className="border-t mt-3 pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount:</span>
                  <span className="font-bold text-xl text-red-600">₹{grandTotal}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full mt-4 bg-red-600 hover:bg-red-700"
                size="lg"
              >
                {processing ? 'Processing...' : `Pay ₹${grandTotal}`}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
