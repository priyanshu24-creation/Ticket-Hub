import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, MapPin, Star } from 'lucide-react';
import { mockMovies, mockEvents, mockSports, mockLiveShows, genres, languages, cities } from '../mock/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState(mockMovies);
  const [events, setEvents] = useState(mockEvents);
  const [sports, setSports] = useState(mockSports);
  const [liveShows, setLiveShows] = useState(mockLiveShows);
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

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'events':
        return events;
      case 'sports':
        return sports;
      case 'live-shows':
        return liveShows;
      default:
        return movies;
    }
  };

  const handleItemClick = (id) => {
    if (activeTab === 'movies') {
      navigate(`/movie/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent cursor-pointer" onClick={() => setActiveTab('movies')}>
                TicketHub
              </h1>
              <div className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => setActiveTab('movies')}
                  className={`transition-colors ${activeTab === 'movies' ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}
                >
                  Movies
                </button>
                <button 
                  onClick={() => setActiveTab('events')}
                  className={`transition-colors ${activeTab === 'events' ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}
                >
                  Events
                </button>
                <button 
                  onClick={() => setActiveTab('sports')}
                  className={`transition-colors ${activeTab === 'sports' ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}
                >
                  Sports
                </button>
                <button 
                  onClick={() => setActiveTab('live-shows')}
                  className={`transition-colors ${activeTab === 'live-shows' ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}
                >
                  Live Shows
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-1 text-sm text-gray-300 hover:text-red-500 transition-colors">
                    <MapPin className="h-4 w-4" />
                    <span>{city}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-gray-800">
                  {cities.map(c => (
                    <DropdownMenuItem 
                      key={c} 
                      onClick={() => setCity(c)}
                      className="text-white hover:bg-gray-800 cursor-pointer"
                    >
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => navigate('/login')} variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search for Movies"
                className="pl-10 w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
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
        <h2 className="text-2xl font-bold text-white mb-6">Recommended Movies</h2>
        
        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found matching your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map(movie => (
              <div
                key={movie.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-[320px] object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{movie.rating}/10</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="text-white text-xs">{movie.votes} votes</div>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-white group-hover:text-red-500 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{movie.genres.join(', ')}</p>
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
