import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const MOVIES_NUM = 30

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

    useEffect(() => {
        fetchMovies(MOVIES_NUM, 0)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY
            const bottomPosition = document.documentElement.offsetHeight

            if (scrollPosition >= bottomPosition && !loading && hasMore) {
                fetchMovies(MOVIES_NUM, movies.length) // Correctly uses the latest state
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
                            <td>{movie.imdb.rating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && <p>Loading...</p>}
        </>
    )
}

export default Home
