import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Share2, Heart } from 'lucide-react';
import { mockMovies, mockTheaters } from '../mock/mockData';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(0);

  useEffect(() => {
    const foundMovie = mockMovies.find(m => m.id === parseInt(id));
    setMovie(foundMovie);
  }, [id]);

  if (!movie) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                TicketHub
              </h1>
            </div>
            <Button onClick={() => navigate('/login')} variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <img src={movie.poster} alt="" className="w-full h-full object-cover blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-300 hover:text-red-500 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-64 h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 bg-gray-800 px-3 py-1 rounded">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{movie.rating}/10</span>
                  <span className="text-gray-400 text-sm ml-2">({movie.votes})</span>
                </div>
                <div className="text-gray-300">{movie.duration}</div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map(genre => (
                  <span key={genre} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
              
              <div className="mb-4">
                <span className="text-gray-400">Languages: </span>
                <span>{movie.languages.join(', ')}</span>
              </div>
              
              <div className="mb-6">
                <span className="text-gray-400">Format: </span>
                <span>{movie.format.join(', ')}</span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">{movie.description}</p>
              
              <div className="flex space-x-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Book Tickets
                </Button>
                <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
                <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="showtimes" className="w-full">
          <TabsList className="mb-6 bg-gray-900 border border-gray-800">
            <TabsTrigger value="showtimes" className="data-[state=active]:bg-red-600">Book Tickets</TabsTrigger>
            <TabsTrigger value="trailer" className="data-[state=active]:bg-red-600">Trailer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="showtimes">
            {/* Date Selection */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {dates.map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(index)}
                  className={`flex-shrink-0 px-6 py-3 rounded-lg border-2 transition-all ${
                    selectedDate === index
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium">{date.day}</div>
                  <div className="text-lg font-bold">{date.date}</div>
                  <div className="text-xs">{date.month}</div>
                </button>
              ))}
            </div>

            {/* Theaters */}
            <div className="space-y-4">
              {mockTheaters.map(theater => (
                <Card key={theater.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{theater.name}</h3>
                      <p className="text-sm text-gray-600">{theater.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {theater.showtimes.map(showtime => (
                      <button
                        key={showtime.id}
                        onClick={() => navigate(`/seat-selection/${movie.id}/${showtime.id}`)}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-red-600 hover:bg-red-50 transition-all group"
                      >
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-red-600">
                          {showtime.time}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{showtime.format}</div>
                        <div className="text-xs text-green-600 mt-1">₹{showtime.price}</div>
                      </button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trailer">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Official Trailer</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={movie.trailer}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MovieDetail;
