import React, { useRef, useState } from 'react'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import './Navbar.css'
import { logout } from '../../firebase'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!isSearchOpen) {
      setIsSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 0);
      return;
    }

    const query = searchValue.trim();

    if (!query) {
      searchInputRef.current?.focus();
      return;
    }

    navigate(`/search/${encodeURIComponent(query)}`);
  }

  const handleSearchBlur = () => {
    if (!searchValue.trim()) {
      setIsSearchOpen(false);
    }
  }

  return (
    <div className='navbar'>
      <div className="navbar-left">
        <img src={logo} alt="" onClick={() => navigate('/')} />
        <ul>
          <li>Home</li>
          <li>TV Show</li>
          <li>Movies</li>
          <li>My List</li>
          <li>Browse by Language</li>
        </ul>
      </div>
      <div className="navbar-right">
        <form className={`navbar-search ${isSearchOpen ? 'search-open' : ''}`} onSubmit={handleSearchSubmit}>
          <button type='submit' aria-label='Search movies'>
            <img src={search_icon} alt="" className='icons' />
          </button>
          <input
            ref={searchInputRef}
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={handleSearchBlur}
            placeholder='Search movies'
          />
        </form>
        <p>Children</p>
        <img src={bell_icon} alt="bell-icon" className='icons' />
        <div className="navbar-profile">
          <img src={profile} alt="profile" className='profile' />
          <img src={caret_icon} alt="dropdowm" />
          <div className="dropdown">
            <p onClick={handleLogOut}>Sign Out of NetaFlex</p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
