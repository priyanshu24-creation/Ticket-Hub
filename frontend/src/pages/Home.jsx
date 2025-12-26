import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, MapPin, Star } from 'lucide-react';
import { mockMovies, genres, languages } from '../mock/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState(mockMovies);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [city, setCity] = useState('Mumbai');

  useEffect(() => {
    filterMovies();
  }, [searchQuery, selectedGenre, selectedLanguage]);

  const filterMovies = () => {
    let filtered = mockMovies;

    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(movie =>
        movie.genres.includes(selectedGenre)
      );
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(movie =>
        movie.languages.includes(selectedLanguage)
      );
    }

    setMovies(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-red-600">BookMyShow</h1>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-700 hover:text-gray-900">Movies</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Events</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Plays</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Sports</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900">
                <MapPin className="h-4 w-4" />
                <span>{city}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <Button onClick={() => navigate('/login')} variant="outline" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Movies</h2>
        
        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No movies found matching your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map(movie => (
              <div
                key={movie.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-[320px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{movie.rating}/10</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="text-white text-xs">{movie.votes} votes</div>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{movie.genres.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
