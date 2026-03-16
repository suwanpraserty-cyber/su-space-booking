from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from database import engine, get_db, SessionLocal
from datetime import datetime

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def home():
    return FileResponse("index.html")

# Drop and recreate all tables to handle schema changes
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

def auto_seed():
    db = SessionLocal()
    try:
        room_count = db.query(models.Room).count()
        if room_count == 0:
            print("No rooms found. Seeding database...")
            from seed_db import seed
            seed()
        else:
            print(f"Database has {room_count} rooms. Skipping seed.")
    finally:
        db.close()

auto_seed()

app = FastAPI(title="SU Space API")

# ────────────────────────────────────────────
# AUTH / PROFILE
# ────────────────────────────────────────────

def get_or_create_user(db: Session) -> models.User:
    user = db.query(models.User).filter(models.User.id == 1).first()
    
    # Check if user email is authorized (for robustness in demo)
    if user and not any(user.email.endswith(d) for d in ["@su.ac.th", "@silpakorn.edu"]):
        # In a real app, we'd raise an error or handle this. For the demo, we'll force the demo user.
        user = None

    if not user:
        user = models.User(
            id=1,
            name="Demo User",
            email="demo@su.ac.th",
            role="Student",
            department="Information Technology",
            phone="081-234-5678",
            profile_image=None
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@app.get("/api/me", response_model=schemas.User)
def get_me(db: Session = Depends(get_db)):
    """Check auth status – always returns the mock user for demo."""
    return get_or_create_user(db)

@app.get("/api/profile", response_model=schemas.User)
def read_profile(db: Session = Depends(get_db)):
    return get_or_create_user(db)

@app.put("/api/profile", response_model=schemas.User)
def update_profile(user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = get_or_create_user(db)
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

# ────────────────────────────────────────────
# ROOMS
# ────────────────────────────────────────────

@app.get("/api/rooms", response_model=List[schemas.Room])
def read_rooms(db: Session = Depends(get_db)):
    return db.query(models.Room).all()

@app.get("/api/rooms/{room_id}", response_model=schemas.Room)
def read_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

# ────────────────────────────────────────────
# BOOKINGS
# ────────────────────────────────────────────

def cancel_expired_bookings(db: Session):
    """
    Disabled confirmation-based auto-cancellation. 
    All bookings are now 'Confirmed' by default and do not require manual confirmation.
    """
    pass

@app.get("/api/bookings", response_model=List[schemas.BookingOut])
def read_bookings(date: str = None, db: Session = Depends(get_db)):
    """Get all bookings, optionally filtered by date (YYYY-MM-DD)."""
    cancel_expired_bookings(db)
    
    # We want to return both Confirmed and Pending Confirmation
    query = db.query(models.Booking).filter(
        models.Booking.status.in_(["Confirmed", "Pending Confirmation"])
    )
    if date:
        query = query.filter(models.Booking.date == date)
    bookings = query.all()
    # Add room_name to each booking
    result = []
    for b in bookings:
        room = db.query(models.Room).filter(models.Room.id == b.room_id).first()
        result.append({
            "id": b.id,
            "user_id": b.user_id,
            "room_id": b.room_id,
            "room_name": room.room_name if room else "Unknown Room",
            "date": str(b.date),
            "start_time": str(b.start_time)[:5],
            "end_time": str(b.end_time)[:5],
            "purpose": b.purpose,
            "status": b.status,
            "created_at": b.created_at
        })
    return result

@app.get("/api/my_bookings", response_model=List[schemas.BookingOut])
def read_my_bookings(db: Session = Depends(get_db)):
    """Get bookings for the current user (user_id=1)."""
    cancel_expired_bookings(db)
    
    bookings = (
        db.query(models.Booking)
        .filter(models.Booking.user_id == 1)
        .order_by(models.Booking.date.desc(), models.Booking.start_time.desc())
        .all()
    )
    result = []
    for b in bookings:
        room = db.query(models.Room).filter(models.Room.id == b.room_id).first()
        result.append({
            "id": b.id,
            "user_id": b.user_id,
            "room_id": b.room_id,
            "room_name": room.room_name if room else "Unknown Room",
            "date": str(b.date),
            "start_time": str(b.start_time)[:5],
            "end_time": str(b.end_time)[:5],
            "purpose": b.purpose,
            "status": b.status,
            "created_at": b.created_at
        })
    return result

@app.post("/api/bookings", response_model=schemas.BookingOut)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    # Validation: start < end
    if booking.start_time >= booking.end_time:
        raise HTTPException(status_code=400, detail="Start time must be before end time")

    # Validation: 30-minute increments
    start_min = int(booking.start_time.split(":")[1])
    end_min = int(booking.end_time.split(":")[1])
    if start_min % 30 != 0 or end_min % 30 != 0:
        raise HTTPException(status_code=400, detail="Time slots must be in 30-minute increments")

    # Validation: Check for conflicts (string comparison works for HH:MM format)
    cancel_expired_bookings(db)
    overlap = db.query(models.Booking).filter(
        models.Booking.room_id == booking.room_id,
        models.Booking.date == booking.date,
        models.Booking.status.in_(["Confirmed", "Pending Confirmation"]),
        models.Booking.start_time < booking.end_time,
        models.Booking.end_time > booking.start_time
    ).first()
    if overlap:
        raise HTTPException(status_code=400, detail="Room is already booked for this time slot")

    def time_to_minutes(t: str) -> int:
        h, m = t.split(":")
        return int(h) * 60 + int(m)

    # Validation: 3-hour daily limit per user
    user_bookings = db.query(models.Booking).filter(
        models.Booking.user_id == 1,
        models.Booking.date == booking.date,
        models.Booking.status == "Confirmed"
    ).all()

    total_minutes = sum(
        time_to_minutes(b.end_time) - time_to_minutes(b.start_time)
        for b in user_bookings
    )
    new_duration = time_to_minutes(booking.end_time) - time_to_minutes(booking.start_time)

    if total_minutes + new_duration > 180:
        remaining = max(0, 180 - total_minutes)
        raise HTTPException(
            status_code=400,
            detail=f"Daily limit (3 hours) exceeded. You have {remaining} minutes remaining today."
        )

    db_booking = models.Booking(
        room_id=booking.room_id,
        date=booking.date,
        start_time=booking.start_time,
        end_time=booking.end_time,
        purpose=booking.purpose,
        user_id=1,
        status="Confirmed"
    )
    print(f"Creating booking with status: {db_booking.status}")
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    print(f"Booking created. DB Status: {db_booking.status}")

    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    return {
        "id": db_booking.id,
        "user_id": db_booking.user_id,
        "room_id": db_booking.room_id,
        "room_name": room.room_name if room else "Unknown Room",
        "date": str(db_booking.date),
        "start_time": str(db_booking.start_time)[:5],
        "end_time": str(db_booking.end_time)[:5],
        "purpose": db_booking.purpose,
        "status": db_booking.status,
        "created_at": db_booking.created_at
    }

@app.post("/api/bookings/{booking_id}/confirm")
def confirm_booking(booking_id: int, db: Session = Depends(get_db)):
    """Confirm a pending booking."""
    db_booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id,
        models.Booking.user_id == 1,
        models.Booking.status == "Pending Confirmation"
    ).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found or already processed")
    
    from datetime import timedelta
    now = datetime.utcnow() + timedelta(hours=7)
    start_dt = datetime.strptime(f"{db_booking.date} {db_booking.start_time}", "%Y-%m-%d %H:%M")
    
    # Check if we have passed the 10-minute deadline
    deadline = start_dt - timedelta(minutes=10)
    
    if now > deadline:
        db_booking.status = "Cancelled"
        db.commit()
        raise HTTPException(status_code=400, detail="The 10-minute confirmation deadline has passed. Room released.")

    db_booking.status = "Confirmed"
    db.commit()
    return {"success": True, "message": "Booking confirmed"}

@app.post("/api/bookings/{booking_id}/cancel")
def cancel_booking_old(booking_id: int, db: Session = Depends(get_db)):
    """Legacy cancel endpoint."""
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db_booking.status = "Cancelled"
    db.commit()
    return {"message": "Booking cancelled"}

@app.post("/api/cancel_booking/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel a booking."""
    db_booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id,
        models.Booking.user_id == 1
    ).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db_booking.status = "Cancelled"
    db.commit()
    return {"success": True, "message": "Booking cancelled"}

# ────────────────────────────────────────────
# Serve Frontend (MUST BE LAST)
# ────────────────────────────────────────────
app.mount("/", StaticFiles(directory="static", html=True), name="static")
