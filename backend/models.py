from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# User Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    email: EmailStr
    phone: str
    password_hash: str
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Movie Models
class Movie(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    tmdb_id: Optional[int] = None
    title: str
    poster: str
    rating: float
    votes: str
    genres: List[str]
    languages: List[str]
    format: List[str]
    duration: str
    release_date: str
    trailer: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Theater Models
class SeatLayout(BaseModel):
    rows: List[str]
    seats_per_row: int

class Theater(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    location: str
    city: str
    total_seats: int
    seat_layout: SeatLayout
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Show Models
class Show(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    movie_id: str
    theater_id: str
    show_date: str
    show_time: str
    format: str
    price: int
    available_seats: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Booking Models
class BookingCreate(BaseModel):
    show_id: str
    seats: List[str]
    email: EmailStr
    phone: str
    session_id: str

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    booking_id: str
    user_id: Optional[str] = None
    show_id: str
    seats: List[str]
    email: EmailStr
    phone: str
    total_amount: int
    payment_status: str = "pending"  # pending, success, failed
    payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Seat Reservation Models
class SeatReservation(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    show_id: str
    seats: List[str]
    session_id: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class SeatReserveRequest(BaseModel):
    show_id: str
    seats: List[str]
    session_id: str

# Payment Models
class PaymentVerify(BaseModel):
    booking_id: str
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str
