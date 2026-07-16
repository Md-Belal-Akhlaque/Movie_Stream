
import Player from './pages/Player/Player'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import './App.css'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { auth } from './firebase'
import Search from './pages/Search/Search'

import { ToastContainer } from 'react-toastify';

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (location.pathname === '/login') {
          navigate('/');
        }
      }
      else {
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    })

    return unsubscribe;
  }, [location.pathname, navigate])

  return (
    <>
      <ToastContainer theme='dark'/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        {/* <Route path='/signup' element={<Signup />} /> */}
        <Route path='/search/:query' element={<Search />} />
        <Route path='/player/:id' element={<Player />} />
      </Routes>
    </>
  )
}

export default App
