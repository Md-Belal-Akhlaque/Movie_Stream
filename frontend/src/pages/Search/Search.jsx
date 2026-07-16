import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Loading from '../../components/Loading/Loading'
import { toast } from 'react-toastify'
import { searchMovies } from '../../services/tmdb'
import './Search.css'

const Search = () => {
  const { query } = useParams();
  const searchQuery = decodeURIComponent(query || '');
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');

    searchMovies(searchQuery)
      .then(res => {
        setMovies((res.results || []).filter(movie => movie.poster_path));
        setStatus('loaded');
      })
      .catch(() => {
        setMovies([]);
        setStatus('error');
        toast.error('Search failed. Please try again.', {
          toastId: 'search-error'
        });
      });
  }, [searchQuery])

  return (
    <div className='search-page'>
      <Navbar />
      <main className="search-content">
        <h1>Search results for "{searchQuery}"</h1>

        {status === 'loading' && <Loading text='Searching movies...' variant='page' />}
        {status === 'error' && <p className='search-message'>Something went wrong. Please try again.</p>}
        {status === 'loaded' && movies.length === 0 && <p className='search-message'>No movies found.</p>}

        <div className="search-grid">
          {movies.map((movie) => (
            <Link to={`/player/${movie.id}`} className="search-card" key={movie.id}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title || movie.original_title} />
              <span>{movie.title || movie.original_title}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Search
