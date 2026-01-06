from fastapi import FastAPI
from backend.src.api.main import app

# This is just to verify the routes are properly configured
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)