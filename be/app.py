from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

import os
from typing import List
from bson import ObjectId
from dotenv import load_dotenv

from models import Movie
from models import Comment

app = FastAPI()

# Cloud MongoDB connection URI
load_dotenv()
MONGO_DETAILS = os.getenv("DB_STRING")
client = AsyncIOMotorClient(MONGO_DETAILS)

#
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Allows all origins
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Access the database and collection
database = client.sample_mflix  # Replace with your database name
movies_collection = database.movies  # Replace with your collection name
comments_collection = database.comments


@app.get("/movies", response_model=List[Movie])
async def get_all_movies(limit: int = 30, offset: int = 0):
    movies_cursor = movies_collection.find().skip(
        offset).limit(limit)
    movies = await movies_cursor.to_list()  # Limit to 100 movies

    if not movies:
        raise HTTPException(status_code=404, detail="No movies found")
    return movies


@app.get("/movies/{id}", response_model=Movie)
async def get_movie(id: str):
    # Convert string to ObjectId
    try:
        movie_id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    movie = await movies_collection.find_one({"_id": movie_id})

    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    next_movie = await movies_collection.find_one(
        {'_id': {'$gt': movie_id}},
        sort=[('_id', 1)]
    )

    if not next_movie:
        next_movie = await movies_collection.find_one(
            {},
            sort=[('_id', 1)]
        )

    movie["next"] = str(next_movie["_id"])

    return movie


@app.get("/movies/{id}/comments", response_model=List[Comment])
async def get_comment(id: str, limit: int = 10, offset: int = 0):
    try:
        movie_id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    comments = await comments_collection.find(
        {"movie_id": movie_id}
    ).skip(offset).limit(limit).to_list()

    if not comments:
        comments = []

    return comments
