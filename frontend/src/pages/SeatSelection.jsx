import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockMovies, mockTheaters, mockSeats } from '../mock/mockData';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { toast } from '../hooks/use-toast';

const SeatSelection = () => {
  const { movieId, showtimeId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const foundMovie = mockMovies.find(m => m.id === parseInt(movieId));
    setMovie(foundMovie);

    // Find showtime
    let foundShowtime = null;
    for (const theater of mockTheaters) {
      foundShowtime = theater.showtimes.find(s => s.id === parseInt(showtimeId));
      if (foundShowtime) {
        foundShowtime.theater = theater;
        break;
      }
    }
    setShowtime(foundShowtime);
  }, [movieId, showtimeId]);

  useEffect(() => {
    if (selectedSeats.length > 0 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            toast({
              title: "Time Expired",
              description: "Your seat reservation has expired. Please select again.",
              variant: "destructive"
            });
            setSelectedSeats([]);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedSeats, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeatClick = (seatId) => {
    if (mockSeats.bookedSeats.includes(seatId) || mockSeats.reservedSeats.includes(seatId)) {
      return;
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 10) {
        toast({
          title: "Maximum seats selected",
          description: "You can select maximum 10 seats per booking."
        });
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
      if (selectedSeats.length === 0) {
        setTimeLeft(300); // Reset timer on first seat selection
      }
    }
  };

  const getSeatStatus = (seatId) => {
    if (mockSeats.bookedSeats.includes(seatId)) return 'booked';
    if (mockSeats.reservedSeats.includes(seatId)) return 'reserved';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const getSeatClass = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-gray-400 cursor-not-allowed';
      case 'reserved':
        return 'bg-orange-300 cursor-not-allowed';
      case 'selected':
        return 'bg-green-500 hover:bg-green-600 text-white';
      default:
        return 'bg-white border-2 border-gray-300 hover:border-green-500 hover:bg-green-50';
    }
  };

  const handleProceedToPay = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to proceed."
      });
      return;
    }
    navigate(`/payment/${movieId}/${showtimeId}`, {
      state: { selectedSeats, movie, showtime }
    });
  };

  if (!movie || !showtime) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const totalPrice = selectedSeats.length * showtime.price;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-red-600">BookMyShow</h1>
            </div>
            {selectedSeats.length > 0 && (
              <div className="text-red-600 font-semibold">
                Time Left: {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/movie/${movieId}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Movie Info */}
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img src={movie.poster} alt={movie.title} className="w-20 h-28 object-cover rounded" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{movie.title}</h2>
              <p className="text-gray-600">{showtime.theater.name}, {showtime.theater.location}</p>
              <p className="text-gray-600">{showtime.time} | {showtime.format}</p>
            </div>
          </div>
        </Card>

        {/* Screen */}
        <div className="mb-8">
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-gradient-to-b from-gray-300 to-gray-100 h-2 rounded-t-full mb-4"></div>
            <p className="text-center text-gray-600 text-sm mb-8">All eyes this way please!</p>
          </div>

          {/* Seats Grid */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="max-w-4xl mx-auto">
              {mockSeats.rows.map((row) => (
                <div key={row} className="flex items-center justify-center mb-3">
                  <div className="w-8 text-center text-gray-600 font-semibold">{row}</div>
                  <div className="flex space-x-2">
                    {Array.from({ length: mockSeats.seatsPerRow }, (_, i) => {
                      const seatId = `${row}${i + 1}`;
                      const status = getSeatStatus(seatId);
                      return (
                        <button
                          key={seatId}
                          onClick={() => handleSeatClick(seatId)}
                          disabled={status === 'booked' || status === 'reserved'}
                          className={`w-8 h-8 rounded-t-lg text-xs font-medium transition-all ${
                            getSeatClass(status)
                          }`}
                          title={seatId}
                        >
                          {status === 'selected' ? '✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center space-x-8 mt-8 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-t-lg"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-t-lg"></div>
                <span className="text-sm text-gray-600">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-400 rounded-t-lg"></div>
                <span className="text-sm text-gray-600">Booked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-300 rounded-t-lg"></div>
                <span className="text-sm text-gray-600">Reserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Selected Seats: {selectedSeats.join(', ')}</div>
                <div className="text-lg font-bold text-gray-900">Total: ₹{totalPrice}</div>
              </div>
              <Button onClick={handleProceedToPay} size="lg" className="bg-red-600 hover:bg-red-700">
                Proceed to Pay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
