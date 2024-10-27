import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import '../styles/Header.css'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const [genres, setGenres] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`)
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_KEY}/genres`)
      const data = await response.json()
      setGenres(data)
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  return (
    <header className="bg-light">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Movies 🎬
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Genres
                </a>
                <ul
                  className="dropdown-menu multi-column"
                  aria-labelledby="navbarDropdown"
                >
                  {genres.map((genre, index) => (
                    <li key={index}>
                      <Link
                        className="dropdown-item"
                        to={`/movies?genre=${genre}`}
                      >
                        {genre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/statistic">
                  Statistics
                </Link>
              </li>
            </ul>

            <form className="d-flex" onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-primary" type="submit">
                Search
              </button>
            </form>
            {/* <button className="btn btn-primary">Sign In</button> */}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
