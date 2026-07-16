import React from 'react'
import netflixSpinner from '../../assets/netflix_spinner.gif'
import './Loading.css'

const Loading = ({ text = 'Loading...', variant = 'page' }) => {
  return (
    <div className={`loading loading-${variant}`}>
      <img src={netflixSpinner} alt="" />
      <p>{text}</p>
    </div>
  )
}

export default Loading
