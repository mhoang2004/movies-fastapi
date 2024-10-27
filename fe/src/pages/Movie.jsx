import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

import Comment from '../components/Comment'

import defaultBookImg from '../assets/images/book_not_found.png'

const Movie = () => {
  const { identifier } = useParams()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMovie = async (identifier) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/movies/${identifier}`
      )
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

  useEffect(() => {
    fetchMovie(identifier)
  }, [identifier])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <>
      <h3 className="mt-2">MOVIE INFORMATION</h3>
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

          <Link
            className="text-secondary-emphasis"
            to={`/movies/${movie.next}`}
          >
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

      <div className="text-center my-3">
        <button className="btn btn-danger">
          <a
            className="text-reset text-decoration-none"
            target="_blank"
            href={`https://www.youtube.com/results?search_query=${movie.title.toLowerCase()}+${
              movie.year
            }`}
          >
            Browse Film
          </a>
        </button>
      </div>

      {/* Conditional rendering of movie details */}
      {movie.fullplot && (
        <p>
          <strong>Plot:</strong> {movie.fullplot}
        </p>
      )}
      {movie.genres && movie.genres.length > 0 && (
        <p>
          <strong>Genres:</strong>{' '}
          {movie.genres
            .map((genre) => (
              <Link
                className="text-dark"
                key={genre}
                to={`/movies?genre=${genre}`}
              >
                {genre}
              </Link>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])}
        </p>
      )}
      {movie.runtime != null && (
        <p>
          <strong>Runtime:</strong> {movie.runtime} minutes
        </p>
      )}
      {movie.cast && movie.cast.length > 0 && (
        <p>
          <strong>Cast:</strong>{' '}
          {movie.cast
            .map((castElement) => (
              <Link
                className="text-dark"
                key={castElement}
                to={`/movies?cast=${castElement}`}
              >
                {castElement}
              </Link>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])}
        </p>
      )}
      {movie.directors && movie.directors.length > 0 && (
        <p>
          <strong>
            {movie.directors.length > 1 ? 'Directors' : 'Director'}:
          </strong>{' '}
          {movie.directors
            .map((director) => (
              <Link
                className="text-dark"
                key={director}
                to={`/movies?director=${director}`}
              >
                {director}
              </Link>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])}
        </p>
      )}
      {movie.writers && movie.writers.length > 0 && (
        <p>
          <strong>{movie.writers.length > 1 ? 'Writers' : 'Writers'}:</strong>{' '}
          {movie.writers.join(', ')}
        </p>
      )}
      {movie.imdb && movie.imdb.rating != null && movie.imdb.votes != null && (
        <div>
          <strong>Rating</strong>
          <ul>
            <li>
              <strong>IMDb:</strong> {movie.imdb.rating} ({movie.imdb.votes}{' '}
              votes)
            </li>
            {movie.tomatoes && movie.tomatoes.viewer && (
              <li>
                <strong>Tomatoes:</strong> {movie.tomatoes.viewer.rating} (
                {movie.tomatoes.viewer.numReviews} votes)
              </li>
            )}
          </ul>
        </div>
      )}
      {movie.languages && movie.languages.length > 0 && (
        <p>
          <strong>Languages:</strong> {movie.languages.join(', ')}
        </p>
      )}

      <h5 className="text-uppercase fw-bold mt-4">comments</h5>
      <hr />
      {movie.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        movie.comments.map((comment, index) => (
          <Comment key={`comment-${index}`} comment={comment} />
        ))
      )}
    </>
  )
}

export default Movie
