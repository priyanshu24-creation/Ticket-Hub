import logging
from typing import Dict

logger = logging.getLogger(__name__)

def send_booking_confirmation_email(email: str, booking_data: Dict):
    """
    Mock email sending function.
    In production, integrate with SendGrid, AWS SES, or similar service.
    """
    logger.info(f"""
    =====================================
    BOOKING CONFIRMATION EMAIL
    =====================================
    To: {email}
    Subject: Your TicketHub Booking Confirmation - {booking_data.get('booking_id')}
    
    Dear Customer,
    
    Your booking has been confirmed!
    
    Booking Details:
    - Booking ID: {booking_data.get('booking_id')}
    - Movie: {booking_data.get('movie_title')}
    - Theater: {booking_data.get('theater_name')}
    - Show Time: {booking_data.get('show_time')}
    - Seats: {', '.join(booking_data.get('seats', []))}
    - Total Amount: ₹{booking_data.get('total_amount')}
    
    Please show this email or your booking QR code at the cinema entrance.
    
    Thank you for choosing TicketHub!
    
    =====================================
    """)
    return True
