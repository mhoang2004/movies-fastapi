import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

import Comment from '../components/Comment'

import defaultBookImg from '../assets/images/book_not_found.png'

const Movie = () => {
    const { identifier } = useParams()
    const navigate = useNavigate()

    const [movie, setMovie] = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchMovie = async (identifier) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/movies/${identifier}`)
            if (!response.ok) {
                throw new Error('Failed to fetch movies')
            }
            const data = await response.json()
            setMovie(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchComments = async (identifier) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_KEY}/movies/${identifier}/comments`
            )
            if (!response.ok) {
                throw new Error('Failed to fetch comments')
            }
            const data = await response.json()
            setComments(data) // Set fetched comments
        } catch (error) {
            setError(error.message)
        }
    }

    useEffect(() => {
        fetchMovie(identifier)
        fetchComments(identifier)
    }, [identifier])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <>
            <h2 className="text-center">Movie Details</h2>
            <hr />
            <div className="text-center mb-4">
                <div className="d-flex justify-content-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-link text-secondary-emphasis"
                    >
                        Prev movie
                    </button>

                    <h3>
                        {movie.title} ({movie.year})
                    </h3>

                    <Link className="text-secondary-emphasis" to={`/movies/${movie.next}`}>
                        Next movie
                    </Link>
                </div>
                <img
                    src={movie.poster ? movie.poster : defaultBookImg}
                    alt={movie.title}
                    style={{ width: '200px', height: 'auto' }}
                    onError={(e) => {
                        e.target.src = defaultBookImg
                    }}
                />
            </div>

            {/* Conditional rendering of movie details */}
            {movie.fullplot && (
                <p>
                    <strong>Plot:</strong> {movie.fullplot}
                </p>
            )}
            {movie.genres && movie.genres.length > 0 && (
                <p>
                    <strong>Genres:</strong> {movie.genres.join(', ')}
                </p>
            )}
            {movie.runtime != null && (
                <p>
                    <strong>Runtime:</strong> {movie.runtime} minutes
                </p>
            )}
            {movie.cast && movie.cast.length > 0 && (
                <p>
                    <strong>Cast:</strong> {movie.cast.join(', ')}
                </p>
            )}
            {movie.directors && movie.directors.length > 0 && (
                <p>
                    <strong>Director(s):</strong> {movie.directors.join(', ')}
                </p>
            )}
            {movie.writers && movie.writers.length > 0 && (
                <p>
                    <strong>Writer(s):</strong> {movie.writers.join(', ')}
                </p>
            )}
            {movie.imdb && movie.imdb.rating != null && movie.imdb.votes != null && (
                <p>
                    <strong>Rating</strong>
                    <ul>
                        <li>
                            <strong>IMDb:</strong> {movie.imdb.rating} ({movie.imdb.votes} votes)
                        </li>
                        {movie.tomatoes && movie.tomatoes.viewer && (
                            <li>
                                <strong>Tomatoes:</strong> {movie.tomatoes.viewer.rating} (
                                {movie.tomatoes.viewer.numReviews} votes)
                            </li>
                        )}
                    </ul>
                </p>
            )}
            {movie.languages && movie.languages.length > 0 && (
                <p>
                    <strong>Languages:</strong> {movie.languages.join(', ')}
                </p>
            )}

            <h5 className="text-uppercase fw-bold mt-4">comments</h5>
            <hr />
            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map((comment, index) => (
                    <Comment key={`comment-${index}`} comment={comment} />
                ))
            )}
        </>
    )
}

export default Movie
