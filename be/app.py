from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

import os
from typing import List
from bson import ObjectId
from dotenv import load_dotenv

from models import Movie
from models import Comment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Allows all origins
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Cloud MongoDB connection URI
load_dotenv()
MONGO_DETAILS = os.getenv("DB_STRING")
client = AsyncIOMotorClient(MONGO_DETAILS)

# Access the database and collection
database = client.sample_mflix  # Replace with your database name
movies_collection = database.movies  # Replace with your collection name
comments_collection = database.comments


@app.get("/movies", response_model=List[Movie])
async def get_all_movies(sort_by: str | None = Query(None, enum=["year", "name", "imdb"]),
                         order: int = Query(0, enum=[-1, 1, 0]),
                         limit: int = 30,
                         offset: int = 0,
                         genre: str | None = None,
                         directors: str | None = None,
                         cast: str | None = None
                         ):

    query = {}

    if genre:
        query["genres"] = genre
    if directors:
        query["directors"] = directors
    if cast:
        query["cast"] = cast

    movies_cursor = movies_collection.find(query)

    if sort_by and order:
        movies_cursor.sort(sort_by, order)

    movies_cursor.skip(
        offset).limit(limit)

    movies = await movies_cursor.to_list()

    if not movies:
        raise HTTPException(status_code=404, detail="No movies found")
    return movies


@ app.get("/movies/{id}", response_model=Movie)
async def get_movie(id: str):
    # Convert string to ObjectId
    try:
        movie_id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    movie = await movies_collection.find_one({"_id": movie_id})

    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    # next movie
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

    # comments
    movie["comments"] = await comments_collection.find(
        {"movie_id": movie_id}
    ).to_list()

    return movie


@app.get("/genres", response_model=List[str])
async def get_distinct_genres():
    distinct_genres = await movies_collection.distinct("genres")
    return distinct_genres


@app.get("/search/{q}", response_model=List[Movie])
async def search_movies(q: str, limit: int = 30, offset: int = 0):
    search_query = {
        "$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"cast": {"$regex": q, "$options": "i"}},
            {"directors": {"$regex": q, "$options": "i"}}
        ]
    }

    movies_cursor = movies_collection.find(
        search_query).skip(
        offset).limit(limit)

    movies = await movies_cursor.to_list()

    if not movies:
        raise HTTPException(
            status_code=404, detail="No movies found matching the search criteria")

    return movies
