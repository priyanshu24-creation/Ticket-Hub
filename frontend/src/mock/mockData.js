// Mock data for initial development

export const mockMovies = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop",
    rating: 9.1,
    votes: "245K",
    genres: ["Action", "Drama", "Thriller"],
    languages: ["Hindi", "Telugu", "Tamil"],
    format: ["2D", "3D", "IMAX"],
    duration: "3h 15m",
    releaseDate: "2024-12-05",
    trailer: "https://www.youtube.com/embed/BhQTkdZFOyo",
    description: "The clash is on as Pushpa and Bhanwar Singh continue their rivalry in this epic conclusion."
  },
  {
    id: 2,
    title: "Stree 2",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    rating: 8.5,
    votes: "189K",
    genres: ["Horror", "Comedy"],
    languages: ["Hindi"],
    format: ["2D"],
    duration: "2h 30m",
    releaseDate: "2024-08-15",
    trailer: "https://www.youtube.com/embed/example",
    description: "The women of Chanderi return with another mysterious entity."
  },
  {
    id: 3,
    title: "Kalki 2898 AD",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=450&fit=crop",
    rating: 8.9,
    votes: "312K",
    genres: ["Sci-Fi", "Action", "Adventure"],
    languages: ["Hindi", "Telugu", "Tamil", "English"],
    format: ["2D", "3D", "IMAX"],
    duration: "3h 0m",
    releaseDate: "2024-06-27",
    trailer: "https://www.youtube.com/embed/example2",
    description: "A modern avatar of Vishnu descends to Earth to protect the world from evil forces."
  },
  {
    id: 4,
    title: "Jawan",
    poster: "https://images.unsplash.com/photo-1574267432644-f74f8ec55d37?w=300&h=450&fit=crop",
    rating: 8.2,
    votes: "278K",
    genres: ["Action", "Thriller"],
    languages: ["Hindi", "Tamil", "Telugu"],
    format: ["2D", "IMAX"],
    duration: "2h 50m",
    releaseDate: "2024-09-07",
    trailer: "https://www.youtube.com/embed/example3",
    description: "A man is driven by a personal vendetta to rectify the wrongs in society."
  }
];

export const mockTheaters = [
  {
    id: 1,
    name: "PVR: Phoenix MarketCity",
    location: "Kurla, Mumbai",
    showtimes: [
      { id: 1, time: "10:30 AM", format: "2D", price: 220, availableSeats: 89 },
      { id: 2, time: "02:15 PM", format: "3D", price: 350, availableSeats: 124 },
      { id: 3, time: "06:45 PM", format: "IMAX", price: 450, availableSeats: 45 },
      { id: 4, time: "09:30 PM", format: "2D", price: 220, availableSeats: 156 }
    ]
  },
  {
    id: 2,
    name: "INOX: R City Mall",
    location: "Ghatkopar, Mumbai",
    showtimes: [
      { id: 5, time: "11:00 AM", format: "2D", price: 200, availableSeats: 67 },
      { id: 6, time: "03:30 PM", format: "3D", price: 320, availableSeats: 98 },
      { id: 7, time: "07:00 PM", format: "2D", price: 200, availableSeats: 34 },
      { id: 8, time: "10:15 PM", format: "3D", price: 320, availableSeats: 112 }
    ]
  },
  {
    id: 3,
    name: "Cinepolis: Viviana Mall",
    location: "Thane, Mumbai",
    showtimes: [
      { id: 9, time: "09:45 AM", format: "2D", price: 180, availableSeats: 145 },
      { id: 10, time: "01:30 PM", format: "2D", price: 180, availableSeats: 78 },
      { id: 11, time: "05:45 PM", format: "3D", price: 300, availableSeats: 56 },
      { id: 12, time: "09:00 PM", format: "3D", price: 300, availableSeats: 89 }
    ]
  }
];

export const mockSeats = {
  rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  seatsPerRow: 20,
  bookedSeats: ['A5', 'A6', 'B10', 'B11', 'C15', 'D7', 'D8', 'E12', 'F5', 'F6', 'F7'],
  reservedSeats: ['G10', 'G11']
};

export const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Sci-Fi', 'Adventure'];
export const languages = ['Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam', 'Kannada'];
