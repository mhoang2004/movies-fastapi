from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from datetime import datetime


class Imdb(BaseModel):
    rating: Optional[float] | str = None
    votes: Optional[int] | str = None
    id: Optional[int] = None


class TomatoesViewer(BaseModel):
    rating: Optional[float] = None
    numReviews: Optional[int] = None


class Tomatoes(BaseModel):
    viewer: Optional[TomatoesViewer] = None
    lastUpdated: Optional[datetime] = None


class Award(BaseModel):
    wins: Optional[int] = None
    nominations: Optional[int] = None
    text: Optional[str] = None


class Comment(BaseModel):
    id: Optional[ObjectId] = Field(..., alias="_id")
    name: Optional[str] = None
    email: Optional[str] = None
    movie_id: Optional[ObjectId] = None
    text: Optional[str] = None
    date: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

        json_encoders = {
            ObjectId: lambda v: str(v),
        }


class Movie(BaseModel):
    id: Optional[ObjectId] = Field(..., alias="_id")
    plot: Optional[str] = None
    genres: Optional[List[str]] = None
    runtime: Optional[int] = None
    rated: Optional[str] = None
    cast: Optional[List[str]] = None
    num_mflix_comments: Optional[int] = None
    poster: Optional[str] = None  # URL field for poster
    title: Optional[str] = None
    fullplot: Optional[str] = None
    languages: Optional[List[str]] = None
    released: Optional[datetime] = None
    directors: Optional[List[str]] = None
    writers: Optional[List[str]] = None
    awards: Optional[Award] = None
    lastupdated: Optional[datetime] = None
    year: Optional[int] | str = None
    imdb: Optional[Imdb] = None
    contries: Optional[str] = None
    tomatoes: Optional[Tomatoes] = None
    comments: Optional[List[Comment]] = []
    ratings: Optional[List[str]] = None
    metacritic: Optional[int] = None
    type: Optional[str] = None
    next: Optional[str] = None

    class Config:
        # Allow population of the Pydantic model using MongoDB's _id field
        populate_by_name = True
        arbitrary_types_allowed = True

        # Optional BSON ObjectId support if needed for MongoDB, convert ObjectId to string
        json_encoders = {
            ObjectId: lambda v: str(v),
            datetime: lambda v: v.strftime('%B %d, %Y')
        }
