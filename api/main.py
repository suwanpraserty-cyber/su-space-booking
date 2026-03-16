from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "SU Space Booking ระบบจองห้องประชุม"}
