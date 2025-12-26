# BookMyShow Clone - API Contracts & Implementation Plan

## Frontend Mock Data to Backend Integration

### Mock Data Currently Used (in /frontend/src/mock/mockData.js)
- **mockMovies**: Array of movie objects with details
- **mockTheaters**: Array of theaters with showtimes
- **mockSeats**: Seat layout configuration with booked/reserved seats
- **genres** and **languages**: Filter options

### Database Models Required

#### 1. Users Collection
```python
{
    "_id": ObjectId,
    "name": str,
    "email": str,
    "phone": str,
    "password_hash": str,
    "created_at": datetime
}
```

#### 2. Movies Collection (TMDB cache)
```python
{
    "_id": ObjectId,
    "tmdb_id": int,
    "title": str,
    "poster": str,
    "rating": float,
    "votes": str,
    "genres": List[str],
    "languages": List[str],
    "format": List[str],
    "duration": str,
    "release_date": str,
    "trailer_url": str,
    "description": str,
    "created_at": datetime
}
```

#### 3. Theaters Collection
```python
{
    "_id": ObjectId,
    "name": str,
    "location": str,
    "city": str,
    "total_seats": int,
    "seat_layout": {
        "rows": List[str],
        "seats_per_row": int
    }
}
```

#### 4. Shows Collection
```python
{
    "_id": ObjectId,
    "movie_id": ObjectId,
    "theater_id": ObjectId,
    "show_date": date,
    "show_time": str,
    "format": str,  # "2D", "3D", "IMAX"
    "price": int,
    "available_seats": int
}
```

#### 5. Bookings Collection
```python
{
    "_id": ObjectId,
    "booking_id": str,  # "BMS{timestamp}"
    "user_id": ObjectId (optional),
    "show_id": ObjectId,
    "seats": List[str],
    "email": str,
    "phone": str,
    "total_amount": int,
    "payment_status": str,  # "pending", "success", "failed"
    "payment_id": str,
    "created_at": datetime
}
```

#### 6. SeatReservations Collection (Temporary locks)
```python
{
    "_id": ObjectId,
    "show_id": ObjectId,
    "seats": List[str],
    "session_id": str,
    "expires_at": datetime,
    "created_at": datetime
}
```

---

## API Endpoints

### Authentication APIs

#### POST /api/auth/register
**Request:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 XXXXX XXXXX",
    "password": "password123"
}
```
**Response:**
```json
{
    "token": "jwt_token",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

#### POST /api/auth/login
**Request:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```
**Response:**
```json
{
    "token": "jwt_token",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

---

### Movie APIs

#### GET /api/movies
**Query Params:** `genre`, `language`, `search`
**Response:**
```json
{
    "movies": [
        {
            "id": "movie_id",
            "title": "Pushpa 2: The Rule",
            "poster": "url",
            "rating": 9.1,
            "votes": "245K",
            "genres": ["Action", "Drama"],
            "languages": ["Hindi", "Telugu"]
        }
    ]
}
```

#### GET /api/movies/:id
**Response:**
```json
{
    "id": "movie_id",
    "title": "Pushpa 2: The Rule",
    "poster": "url",
    "rating": 9.1,
    "votes": "245K",
    "genres": ["Action", "Drama"],
    "languages": ["Hindi", "Telugu"],
    "format": ["2D", "3D", "IMAX"],
    "duration": "3h 15m",
    "release_date": "2024-12-05",
    "trailer": "youtube_url",
    "description": "Description..."
}
```

#### GET /api/movies/:id/shows
**Query Params:** `date`, `city`
**Response:**
```json
{
    "theaters": [
        {
            "id": "theater_id",
            "name": "PVR: Phoenix MarketCity",
            "location": "Kurla, Mumbai",
            "showtimes": [
                {
                    "id": "show_id",
                    "time": "10:30 AM",
                    "format": "2D",
                    "price": 220,
                    "available_seats": 89
                }
            ]
        }
    ]
}
```

---

### Booking APIs

#### GET /api/shows/:show_id/seats
**Response:**
```json
{
    "rows": ["A", "B", "C", ...],
    "seats_per_row": 20,
    "booked_seats": ["A5", "A6", "B10"],
    "reserved_seats": ["G10", "G11"]
}
```

#### POST /api/seats/reserve
**Request:**
```json
{
    "show_id": "show_id",
    "seats": ["G10", "G11"],
    "session_id": "unique_session_id"
}
```
**Response:**
```json
{
    "success": true,
    "expires_at": "2024-12-26T10:35:00Z",
    "message": "Seats reserved for 5 minutes"
}
```

#### POST /api/bookings/create
**Request:**
```json
{
    "show_id": "show_id",
    "seats": ["G10", "G11"],
    "email": "user@example.com",
    "phone": "+91 XXXXX XXXXX",
    "session_id": "unique_session_id"
}
```
**Response:**
```json
{
    "booking_id": "BMS1234567890",
    "payment_order_id": "razorpay_order_id",
    "amount": 440,
    "currency": "INR"
}
```

#### POST /api/payment/verify
**Request:**
```json
{
    "booking_id": "BMS1234567890",
    "payment_id": "razorpay_payment_id",
    "order_id": "razorpay_order_id",
    "signature": "razorpay_signature"
}
```
**Response:**
```json
{
    "success": true,
    "booking": {
        "booking_id": "BMS1234567890",
        "movie": {...},
        "showtime": {...},
        "seats": ["G10", "G11"],
        "total_amount": 440
    }
}
```

#### GET /api/bookings/:booking_id
**Response:**
```json
{
    "booking_id": "BMS1234567890",
    "movie": {...},
    "showtime": {...},
    "theater": {...},
    "seats": ["G10", "G11"],
    "email": "user@example.com",
    "phone": "+91 XXXXX XXXXX",
    "total_amount": 440,
    "payment_status": "success",
    "created_at": "2024-12-26T10:30:00Z"
}
```

---

### Admin APIs

#### GET /api/admin/analytics
**Headers:** `Authorization: Bearer {admin_token}`
**Response:**
```json
{
    "total_revenue": 1250000,
    "total_bookings": 5678,
    "popular_movies": [
        {
            "title": "Pushpa 2",
            "bookings": 1234,
            "revenue": 456789
        }
    ],
    "busiest_theaters": [
        {
            "name": "PVR Phoenix",
            "bookings": 567
        }
    ]
}
```

---

## Background Jobs

### 1. Seat Reservation Cleanup
- **Frequency:** Every 1 minute
- **Action:** Delete expired seat reservations from `seat_reservations` collection

### 2. TMDB Movie Sync
- **Frequency:** Daily
- **Action:** Fetch and update popular movies from TMDB API

---

## Integration Steps

### Phase 1: Authentication
1. Replace localStorage mock auth with JWT-based authentication
2. Update frontend to use auth endpoints
3. Store JWT token in localStorage

### Phase 2: Movies
1. Implement TMDB integration to fetch movies
2. Create movies endpoints
3. Replace mock movies data with API calls

### Phase 3: Booking Flow
1. Implement seat reservation with timeout
2. Create booking endpoints
3. Integrate Razorpay payment gateway
4. Update frontend to use real booking APIs

### Phase 4: Email & Admin
1. Implement email confirmation (mock for now)
2. Create admin dashboard APIs
3. Build admin frontend

---

## External Integrations

### 1. TMDB API
- **API Key:** c8dea14dc917687ac631a52620e4f7ad (backup: 3cb41ecea3bf606c56552db3d17adefd)
- **Base URL:** https://api.themoviedb.org/3
- **Usage:** Fetch movie details, posters, trailers

### 2. Razorpay (Test Mode)
- **Key ID:** Will be added
- **Key Secret:** Will be added
- **Usage:** Payment processing

### 3. Email Service
- **Strategy:** Mock email sending (log to console)
- **Implementation:** Create email template and log booking details

---

## Notes
- All dates should use ISO format
- Prices are in INR (₹)
- Session timeout for seat reservation: 5 minutes
- Maximum 10 seats per booking
