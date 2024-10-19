import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const MOVIES_NUM = 30
  const scrollPositionKey = 'scrollPosition' // Key for local storage

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true) // Track if more movies are available

  const fetchMovies = async (limit, offset) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/movies?limit=${limit}&offset=${offset}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }

      const data = await response.json()

      if (data.length < limit) setHasMore(false)

      setMovies((prev) => [...prev, ...data])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = () => {
    localStorage.setItem(scrollPositionKey, window.scrollY)

    const scrollPosition = window.innerHeight + window.scrollY
    const bottomPosition = document.documentElement.offsetHeight

    if (scrollPosition >= bottomPosition) {
      fetchMovies(MOVIES_NUM, movies.length)
    }
  }

  useEffect(() => {
    fetchMovies(MOVIES_NUM, 0)

    const savedPosition = localStorage.getItem(scrollPositionKey)

    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10))
    }

    // add event scroll to our page
    window.addEventListener('scroll', handleScroll)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (error) return <p>Error: {error}</p>

  return (
    <>
      <h2 className="text-center my-2">All Movies</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Movie Name</th>
            <th scope="col">Year</th>
            <th scope="col">IMDb</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={`${movie._id}-home`}>
              <th scope="row">{index + 1}</th>
              <td>
                <Link
                  className="text-decoration-none text-reset"
                  to={`/movies/${movie._id}`}
                >
                  {movie.title}
                </Link>
              </td>
              <td>{movie.year}</td>
              <td>{movie.imdb.rating}</td>
            </tr>
          ))}

          {hasMore && loading ? (
            <tr>
              <td>Loading...</td>
            </tr>
          ) : (
            ''
          )}
        </tbody>
      </table>
    </>
  )
}

export default Home
