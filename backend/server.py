from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional
import time

# Import models
from models import (
    UserCreate, UserLogin,
    BookingCreate,
    SeatReserveRequest, PaymentVerify
)

# Import utilities
from utils.auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from utils.email import send_booking_confirmation_email
from utils.payment import create_order, verify_payment_signature

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================
# AUTHENTICATION ENDPOINTS
# ============================================

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user_data.dict()
    user_dict["password_hash"] = get_password_hash(user_dict.pop("password"))
    user_dict["is_admin"] = False
    user_dict["created_at"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_dict["email"], "user_id": user_id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "token": access_token,
        "user": {
            "id": user_id,
            "name": user_dict["name"],
            "email": user_dict["email"]
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    """Login user"""
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user["email"], "user_id": str(user["_id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "token": access_token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "is_admin": user.get("is_admin", False)
        }
    }

# ============================================
# MOVIE ENDPOINTS
# ============================================

@api_router.get("/movies")
async def get_movies(
    genre: Optional[str] = None,
    language: Optional[str] = None,
    search: Optional[str] = None
):
    """Get all movies with optional filters"""
    query = {}
    
    if genre and genre != "all":
        query["genres"] = genre
    
    if language and language != "all":
        query["languages"] = language
    
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    
    movies_cursor = db.movies.find(query)
    movies = await movies_cursor.to_list(length=100)
    
    # Convert ObjectId to string
    for movie in movies:
        movie["id"] = str(movie.pop("_id"))
    
    return {"movies": movies}

@api_router.get("/movies/{movie_id}")
async def get_movie(movie_id: str):
    """Get single movie by ID"""
    movie = await db.movies.find_one({"_id": movie_id})
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    movie["id"] = str(movie.pop("_id"))
    return movie

@api_router.get("/movies/{movie_id}/shows")
async def get_movie_shows(movie_id: str, date: Optional[str] = None, city: str = "Mumbai"):
    """Get shows for a movie"""
    query = {"movie_id": movie_id}
    if date:
        query["show_date"] = date
    
    shows_cursor = db.shows.find(query)
    shows = await shows_cursor.to_list(length=100)
    
    # Group shows by theater
    theaters_dict = {}
    for show in shows:
        theater_id = show["theater_id"]
        if theater_id not in theaters_dict:
            theater = await db.theaters.find_one({"_id": theater_id, "city": city})
            if theater:
                theaters_dict[theater_id] = {
                    "id": str(theater["_id"]),
                    "name": theater["name"],
                    "location": theater["location"],
                    "showtimes": []
                }
        
        if theater_id in theaters_dict:
            theaters_dict[theater_id]["showtimes"].append({
                "id": str(show["_id"]),
                "time": show["show_time"],
                "format": show["format"],
                "price": show["price"],
                "available_seats": show["available_seats"]
            })
    
    return {"theaters": list(theaters_dict.values())}

# ============================================
# BOOKING ENDPOINTS
# ============================================

@api_router.get("/shows/{show_id}/seats")
async def get_show_seats(show_id: str):
    """Get seat availability for a show"""
    show = await db.shows.find_one({"_id": show_id})
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    theater = await db.theaters.find_one({"_id": show["theater_id"]})
    if not theater:
        raise HTTPException(status_code=404, detail="Theater not found")
    
    # Get booked seats
    bookings_cursor = db.bookings.find({"show_id": show_id, "payment_status": "success"})
    bookings = await bookings_cursor.to_list(length=1000)
    booked_seats = []
    for booking in bookings:
        booked_seats.extend(booking["seats"])
    
    # Get reserved seats (not expired)
    now = datetime.utcnow()
    reservations_cursor = db.seat_reservations.find({
        "show_id": show_id,
        "expires_at": {"$gt": now}
    })
    reservations = await reservations_cursor.to_list(length=1000)
    reserved_seats = []
    for reservation in reservations:
        reserved_seats.extend(reservation["seats"])
    
    return {
        "rows": theater["seat_layout"]["rows"],
        "seats_per_row": theater["seat_layout"]["seats_per_row"],
        "booked_seats": booked_seats,
        "reserved_seats": reserved_seats
    }

@api_router.post("/seats/reserve")
async def reserve_seats(reservation: SeatReserveRequest):
    """Reserve seats temporarily for 5 minutes"""
    show = await db.shows.find_one({"_id": reservation.show_id})
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    # Check if seats are already booked or reserved
    booked_seats_query = await db.bookings.find({
        "show_id": reservation.show_id,
        "payment_status": "success"
    }).to_list(length=1000)
    
    booked_seats = []
    for booking in booked_seats_query:
        booked_seats.extend(booking["seats"])
    
    # Check reserved seats
    now = datetime.utcnow()
    reserved_seats_query = await db.seat_reservations.find({
        "show_id": reservation.show_id,
        "expires_at": {"$gt": now},
        "session_id": {"$ne": reservation.session_id}
    }).to_list(length=1000)
    
    reserved_seats = []
    for res in reserved_seats_query:
        reserved_seats.extend(res["seats"])
    
    # Check for conflicts
    unavailable = set(reservation.seats) & (set(booked_seats) | set(reserved_seats))
    if unavailable:
        raise HTTPException(
            status_code=400,
            detail=f"Seats {list(unavailable)} are not available"
        )
    
    # Delete existing reservation for this session
    await db.seat_reservations.delete_many({"session_id": reservation.session_id})
    
    # Create new reservation
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    reservation_doc = {
        "show_id": reservation.show_id,
        "seats": reservation.seats,
        "session_id": reservation.session_id,
        "expires_at": expires_at,
        "created_at": datetime.utcnow()
    }
    
    await db.seat_reservations.insert_one(reservation_doc)
    
    return {
        "success": True,
        "expires_at": expires_at.isoformat(),
        "message": "Seats reserved for 5 minutes"
    }

@api_router.post("/bookings/create")
async def create_booking(booking_data: BookingCreate):
    """Create a new booking"""
    show = await db.shows.find_one({"_id": booking_data.show_id})
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    # Verify reservation exists
    reservation = await db.seat_reservations.find_one({
        "show_id": booking_data.show_id,
        "session_id": booking_data.session_id,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not reservation:
        raise HTTPException(status_code=400, detail="Seat reservation expired")
    
    # Calculate total amount
    num_seats = len(booking_data.seats)
    convenience_fee = num_seats * 20
    total_amount = (show["price"] * num_seats) + convenience_fee
    
    # Create booking
    booking_id = f"TH{int(time.time())}"
    
    # Create Razorpay order
    order = create_order(total_amount, receipt=booking_id)
    
    booking_doc = {
        "_id": booking_id,
        "booking_id": booking_id,
        "show_id": booking_data.show_id,
        "seats": booking_data.seats,
        "email": booking_data.email,
        "phone": booking_data.phone,
        "total_amount": total_amount,
        "payment_status": "pending",
        "razorpay_order_id": order["id"],
        "created_at": datetime.utcnow()
    }
    
    await db.bookings.insert_one(booking_doc)
    
    return {
        "booking_id": booking_id,
        "payment_order_id": order["id"],
        "amount": total_amount,
        "currency": "INR"
    }

@api_router.post("/payment/verify")
async def verify_payment(payment_data: PaymentVerify, background_tasks: BackgroundTasks):
    """Verify payment and confirm booking"""
    # Verify signature
    is_valid = verify_payment_signature(
        payment_data.razorpay_order_id,
        payment_data.razorpay_payment_id,
        payment_data.razorpay_signature
    )
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    # Update booking
    result = await db.bookings.update_one(
        {"booking_id": payment_data.booking_id},
        {
            "$set": {
                "payment_status": "success",
                "payment_id": payment_data.razorpay_payment_id
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Get booking details
    booking = await db.bookings.find_one({"booking_id": payment_data.booking_id})
    show = await db.shows.find_one({"_id": booking["show_id"]})
    movie = await db.movies.find_one({"_id": show["movie_id"]})
    theater = await db.theaters.find_one({"_id": show["theater_id"]})
    
    # Delete reservation
    await db.seat_reservations.delete_many({"show_id": booking["show_id"]})
    
    # Send email confirmation in background
    email_data = {
        "booking_id": booking["booking_id"],
        "movie_title": movie["title"],
        "theater_name": theater["name"],
        "show_time": show["show_time"],
        "seats": booking["seats"],
        "total_amount": booking["total_amount"]
    }
    background_tasks.add_task(send_booking_confirmation_email, booking["email"], email_data)
    
    return {
        "success": True,
        "booking": {
            "booking_id": booking["booking_id"],
            "movie": movie,
            "showtime": show,
            "theater": theater,
            "seats": booking["seats"],
            "total_amount": booking["total_amount"]
        }
    }

@api_router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str):
    """Get booking details"""
    booking = await db.bookings.find_one({"booking_id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    show = await db.shows.find_one({"_id": booking["show_id"]})
    movie = await db.movies.find_one({"_id": show["movie_id"]})
    theater = await db.theaters.find_one({"_id": show["theater_id"]})
    
    return {
        "booking_id": booking["booking_id"],
        "movie": {
            "id": str(movie["_id"]),
            "title": movie["title"],
            "poster": movie["poster"],
            "genres": movie["genres"]
        },
        "showtime": {
            "time": show["show_time"],
            "format": show["format"]
        },
        "theater": {
            "name": theater["name"],
            "location": theater["location"]
        },
        "seats": booking["seats"],
        "email": booking["email"],
        "phone": booking["phone"],
        "total_amount": booking["total_amount"],
        "payment_status": booking["payment_status"],
        "created_at": booking["created_at"].isoformat()
    }

# ============================================
# ADMIN ENDPOINTS
# ============================================

@api_router.get("/admin/analytics")
async def get_analytics():
    """Get admin analytics"""
    # Total revenue
    bookings_cursor = db.bookings.find({"payment_status": "success"})
    bookings = await bookings_cursor.to_list(length=10000)
    total_revenue = sum(b["total_amount"] for b in bookings)
    total_bookings = len(bookings)
    
    # Popular movies
    movie_stats = {}
    for booking in bookings:
        show = await db.shows.find_one({"_id": booking["show_id"]})
        if show:
            movie_id = show["movie_id"]
            if movie_id not in movie_stats:
                movie_stats[movie_id] = {"bookings": 0, "revenue": 0}
            movie_stats[movie_id]["bookings"] += 1
            movie_stats[movie_id]["revenue"] += booking["total_amount"]
    
    popular_movies = []
    for movie_id, stats in sorted(movie_stats.items(), key=lambda x: x[1]["bookings"], reverse=True)[:5]:
        movie = await db.movies.find_one({"_id": movie_id})
        if movie:
            popular_movies.append({
                "title": movie["title"],
                "bookings": stats["bookings"],
                "revenue": stats["revenue"]
            })
    
    # Busiest theaters
    theater_stats = {}
    for booking in bookings:
        show = await db.shows.find_one({"_id": booking["show_id"]})
        if show:
            theater_id = show["theater_id"]
            theater_stats[theater_id] = theater_stats.get(theater_id, 0) + 1
    
    busiest_theaters = []
    for theater_id, count in sorted(theater_stats.items(), key=lambda x: x[1], reverse=True)[:5]:
        theater = await db.theaters.find_one({"_id": theater_id})
        if theater:
            busiest_theaters.append({
                "name": theater["name"],
                "bookings": count
            })
    
    return {
        "total_revenue": total_revenue,
        "total_bookings": total_bookings,
        "popular_movies": popular_movies,
        "busiest_theaters": busiest_theaters
    }

# ============================================
# UTILITY ENDPOINTS
# ============================================

@api_router.get("/")
async def root():
    return {"message": "TicketHub API is running"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
