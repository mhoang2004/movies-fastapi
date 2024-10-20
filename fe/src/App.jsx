import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import Movie from './pages/Movie'

function App() {
    return (
        <>
            <Router>
                <Header />

                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/movies" element={<Home />} />
                        <Route path="/movies/:identifier" element={<Movie />} />
                    </Routes>
                </div>
            </Router>
        </>
    )
}

export default App
