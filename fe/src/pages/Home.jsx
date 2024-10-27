import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import SortButton from '../components/SortButton'

const Home = () => {
  const MOVIES_NUM = 30

  const [searchParams] = useSearchParams()

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true) // Track if more movies are available

  const [sortBy, setSortBy] = useState('')
  const [order, setOrder] = useState(0)

  const fetchMovies = async (limit = MOVIES_NUM, offset = 0) => {
    setLoading(true)

    const genreParam = searchParams.get('genre')
    const directorParam = searchParams.get('director')
    const castParam = searchParams.get('cast')

    try {
      let apiUrl = `${
        import.meta.env.VITE_API_KEY
      }/movies?limit=${limit}&offset=${offset}`

      if (sortBy && order) {
        apiUrl += `&sort_by=${sortBy}&order=${order}`
      }
      if (genreParam) {
        apiUrl += `&genre=${genreParam}`
      }
      if (directorParam) {
        apiUrl += `&directors=${directorParam}`
      }
      if (castParam) {
        apiUrl += `&cast=${castParam}`
      }

      const response = await fetch(apiUrl)

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

  const handleSort = (sortByValue, orderValue) => {
    setMovies([])

    if (sortByValue !== sortBy) setSortBy(sortByValue)
    setOrder(orderValue)
  }

  useEffect(() => {
    setMovies([])
    fetchMovies()
  }, [sortBy, order, searchParams])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY
      const bottomPosition = document.documentElement.offsetHeight

      if (scrollPosition >= bottomPosition && !loading && hasMore) {
        fetchMovies(MOVIES_NUM, movies.length)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [movies, loading, hasMore])

  if (error) return <p>Error: {error}</p>

  return (
    <>
      <h2 className="text-center my-2">All Movies</h2>
      {searchParams.get('genre') && (
        <p>
          <strong>Genre: </strong>
          {searchParams.get('genre')}
        </p>
      )}
      {searchParams.get('director') && (
        <p>
          <strong>Director: </strong>
          {searchParams.get('director')}
        </p>
      )}
      {searchParams.get('cast') && (
        <p>
          <strong>Cast: </strong>
          {searchParams.get('cast')}
        </p>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">
              <span className="me-2">Movie Name</span>
              <SortButton name="name" onSortChange={handleSort} />
            </th>
            <th scope="col">
              <span className="me-2">Year</span>
              <SortButton name="year" onSortChange={handleSort} />
            </th>
            <th scope="col">
              <span className="me-2">IMDb</span>
              <SortButton name="imdb" onSortChange={handleSort} />
            </th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={movie._id}>
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
              <td>{movie.imdb.rating ? movie.imdb.rating : 'updating...'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <p>Loading...</p>}
    </>
  )
}

export default Home
