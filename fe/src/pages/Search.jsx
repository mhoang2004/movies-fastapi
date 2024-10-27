import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const Search = () => {
  const [searchParams] = useSearchParams()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const query = searchParams.get('q')

  const fetchMovies = async (searchQuery) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/search/${searchQuery}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }

      const data = await response.json()
      setMovies(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMovies([])
    if (query) {
      fetchMovies(query)
    }
  }, [query])

  return (
    <div>
      <h3 className="my-2">Search results for "{query}":</h3>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div>
        {movies.length > 0 ? (
          <ul className="list-group mt-4">
            {movies.map((movie) => (
              <li className="list-group-item" key={movie._id}>
                <p>
                  <strong>
                    {/* {movie.title} ({movie.year})<Link to={}></Link> */}

                    <Link
                      className="text-decoration-none text-reset"
                      to={`/movies/${movie._id}`}
                    >
                      {movie.title} ({movie.year})
                    </Link>
                  </strong>
                </p>
                {movie.cast && (
                  <p>
                    <strong>Cast: </strong> {movie.cast.join(', ')}
                  </p>
                )}
                {movie.directors && (
                  <p>
                    <strong>Director: </strong> {movie.directors.join(', ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No movies found.</p>
        )}
      </div>
    </div>
  )
}

export default Search
