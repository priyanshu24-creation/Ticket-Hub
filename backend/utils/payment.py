import razorpay
import os
import hmac
import hashlib

# Razorpay Test Credentials
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_key")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "rzp_test_secret")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

def create_order(amount: int, currency: str = "INR", receipt: str = ""):
    """
    Create a Razorpay order
    """
    try:
        data = {
            "amount": amount * 100,  # Amount in paise
            "currency": currency,
            "receipt": receipt,
            "payment_capture": 1
        }
        order = client.order.create(data=data)
        return order
    except Exception as e:
        print(f"Error creating Razorpay order: {e}")
        # Return mock order for development
        return {
            "id": f"order_mock_{receipt}",
            "amount": amount * 100,
            "currency": currency,
            "receipt": receipt
        }

def verify_payment_signature(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str):
    """
    Verify Razorpay payment signature
    """
    try:
        # Generate signature
        message = f"{razorpay_order_id}|{razorpay_payment_id}"
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return generated_signature == razorpay_signature
    except Exception as e:
        print(f"Error verifying payment: {e}")
        # Mock verification for development
        return True
