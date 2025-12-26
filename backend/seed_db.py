"""
Database seeding script for TicketHub
Populates MongoDB with initial movies, theaters, and shows data
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_movies():
    """Seed movies collection"""
    movies = [
        {
            "_id": "1",
            "title": "Pushpa 2: The Rule",
            "poster": "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop",
            "rating": 9.1,
            "votes": "245K",
            "genres": ["Action", "Drama", "Thriller"],
            "languages": ["Hindi", "Telugu", "Tamil"],
            "format": ["2D", "3D", "IMAX"],
            "duration": "3h 15m",
            "release_date": "2024-12-05",
            "trailer": "BhQTkdZFOyo",
            "description": "The clash is on as Pushpa and Bhanwar Singh continue their rivalry in this epic conclusion.",
            "created_at": datetime.utcnow()
        },
        {
            "_id": "2",
            "title": "Stree 2",
            "poster": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
            "rating": 8.5,
            "votes": "189K",
            "genres": ["Horror", "Comedy"],
            "languages": ["Hindi"],
            "format": ["2D"],
            "duration": "2h 30m",
            "release_date": "2024-08-15",
            "trailer": "KVnheWSKu0w",
            "description": "The women of Chanderi return with another mysterious entity.",
            "created_at": datetime.utcnow()
        },
        {
            "_id": "3",
            "title": "Kalki 2898 AD",
            "poster": "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=450&fit=crop",
            "rating": 8.9,
            "votes": "312K",
            "genres": ["Sci-Fi", "Action", "Adventure"],
            "languages": ["Hindi", "Telugu", "Tamil", "English"],
            "format": ["2D", "3D", "IMAX"],
            "duration": "3h 0m",
            "release_date": "2024-06-27",
            "trailer": "e3YzyAFric0",
            "description": "A modern avatar of Vishnu descends to Earth to protect the world from evil forces.",
            "created_at": datetime.utcnow()
        },
        {
            "_id": "4",
            "title": "Jawan",
            "poster": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
            "rating": 8.2,
            "votes": "278K",
            "genres": ["Action", "Thriller"],
            "languages": ["Hindi", "Tamil", "Telugu"],
            "format": ["2D", "IMAX"],
            "duration": "2h 50m",
            "release_date": "2024-09-07",
            "trailer": "CEZbKlJJ0bU",
            "description": "A man is driven by a personal vendetta to rectify the wrongs in society.",
            "created_at": datetime.utcnow()
        },
        {
            "_id": "5",
            "title": "Inception",
            "poster": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop",
            "rating": 8.8,
            "votes": "2.5M",
            "genres": ["Sci-Fi", "Thriller", "Action"],
            "languages": ["English", "Hindi"],
            "format": ["2D", "IMAX"],
            "duration": "2h 28m",
            "release_date": "2010-07-16",
            "trailer": "YoHD9XEInc0",
            "description": "A thief who steals corporate secrets through dream-sharing technology.",
            "created_at": datetime.utcnow()
        },
        {
            "_id": "6",
            "title": "Breaking Bad",
            "poster": "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=300&h=450&fit=crop",
            "rating": 9.5,
            "votes": "1.8M",
            "genres": ["Crime", "Drama", "Thriller"],
            "languages": ["English", "Hindi"],
            "format": ["2D"],
            "duration": "Series",
            "release_date": "2008-01-20",
            "trailer": "HhesaQXLuRY",
            "description": "A chemistry teacher turned methamphetamine producer partners with a former student.",
            "created_at": datetime.utcnow()
        },
        {
            "_id": "7",
            "title": "Kantara: Chapter 1",
            "poster": "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=300&h=450&fit=crop",
            "rating": 8.3,
            "votes": "156K",
            "genres": ["Action", "Drama", "Thriller"],
            "languages": ["Kannada", "Hindi", "Telugu", "Tamil"],
            "format": ["2D"],
            "duration": "2h 28m",
            "release_date": "2022-09-30",
            "trailer": "8mrVmf239GU",
            "description": "A tale of a man and nature's fight for co-existence.",
            "created_at": datetime.utcnow()
        },
        {
            "_id": "8",
            "title": "Avengers: Doomsday",
            "poster": "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
            "rating": 9.2,
            "votes": "3.2M",
            "genres": ["Action", "Adventure", "Sci-Fi"],
            "languages": ["English", "Hindi", "Tamil", "Telugu"],
            "format": ["2D", "3D", "IMAX"],
            "duration": "3h 5m",
            "release_date": "2026-05-01",
            "trailer": "eOrNdBpGMv8",
            "description": "The Avengers face their greatest threat yet as Doctor Doom emerges.",
            "created_at": datetime.utcnow()
        }
    ]
    
    # Clear existing movies
    await db.movies.delete_many({})
    # Insert new movies
    await db.movies.insert_many(movies)
    print(f"✓ Seeded {len(movies)} movies")

async def seed_theaters():
    """Seed theaters collection"""
    theaters = [
        {
            "_id": "theater1",
            "name": "PVR: Phoenix MarketCity",
            "location": "Kurla, Mumbai",
            "city": "Mumbai",
            "total_seats": 200,
            "seat_layout": {
                "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
                "seats_per_row": 20
            },
            "created_at": datetime.utcnow()
        },
        {
            "_id": "theater2",
            "name": "INOX: R City Mall",
            "location": "Ghatkopar, Mumbai",
            "city": "Mumbai",
            "total_seats": 200,
            "seat_layout": {
                "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
                "seats_per_row": 20
            },
            "created_at": datetime.utcnow()
        },
        {
            "_id": "theater3",
            "name": "Cinepolis: Viviana Mall",
            "location": "Thane, Mumbai",
            "city": "Mumbai",
            "total_seats": 200,
            "seat_layout": {
                "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
                "seats_per_row": 20
            },
            "created_at": datetime.utcnow()
        }
    ]
    
    # Clear existing theaters
    await db.theaters.delete_many({})
    # Insert new theaters
    await db.theaters.insert_many(theaters)
    print(f"✓ Seeded {len(theaters)} theaters")

async def seed_shows():
    """Seed shows collection"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    shows = []
    show_id_counter = 1
    
    # Movies to create shows for
    movie_ids = ["1", "2", "3", "4", "5", "6", "7", "8"]
    theater_ids = ["theater1", "theater2", "theater3"]
    
    times = ["10:30 AM", "02:15 PM", "06:45 PM", "09:30 PM"]
    formats = ["2D", "3D", "IMAX", "2D"]
    prices = [220, 350, 450, 220]
    
    for movie_id in movie_ids:
        for theater_id in theater_ids:
            for i, time in enumerate(times):
                shows.append({
                    "_id": str(show_id_counter),
                    "movie_id": movie_id,
                    "theater_id": theater_id,
                    "show_date": today,
                    "show_time": time,
                    "format": formats[i],
                    "price": prices[i],
                    "available_seats": 200,
                    "created_at": datetime.utcnow()
                })
                show_id_counter += 1
    
    # Clear existing shows
    await db.shows.delete_many({})
    # Insert new shows
    await db.shows.insert_many(shows)
    print(f"✓ Seeded {len(shows)} shows")

async def main():
    """Main seeding function"""
    print("Starting database seeding...")
    
    try:
        await seed_movies()
        await seed_theaters()
        await seed_shows()
        
        print("\n✓ Database seeding completed successfully!")
        print("\nDatabase now contains:")
        print(f"  - {await db.movies.count_documents({})} movies")
        print(f"  - {await db.theaters.count_documents({})} theaters")
        print(f"  - {await db.shows.count_documents({})} shows")
        
    except Exception as e:
        print(f"\n✗ Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
