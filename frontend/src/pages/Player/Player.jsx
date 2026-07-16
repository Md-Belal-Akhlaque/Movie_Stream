import React, { useEffect, useState } from 'react'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import './Player.css'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../components/Loading/Loading'
import { toast } from 'react-toastify'
import { getMovieVideos } from '../../services/tmdb'
const Player = () => {

  const {id} = useParams();
  const navigate = useNavigate();

  const [movieDetails, setMovieDetails] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  });
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');

    getMovieVideos(id)
      .then(res => {
        const trailer = res.results?.[0];

        if (!trailer) {
          setStatus('empty');
          return;
        }

        setMovieDetails(trailer);
        setStatus('loaded');
      })
      .catch(() => {
        setStatus('error');
        toast.error('Could not load trailer. Please try again.', {
          toastId: 'trailer-error'
        });
      });
  }, [id])


  return (


    <div className='player'>
      <img src={back_arrow_icon} alt="" onClick={()=>{navigate(-1)}} />
      {status === 'loading' && <Loading text='Loading trailer...' variant='page' />}
      {status === 'error' && <p className='player-message'>Unable to load trailer right now.</p>}
      {status === 'empty' && <p className='player-message'>No trailer found for this movie.</p>}
      {status === 'loaded' && (
        <>
          <iframe
            src={`https://www.youtube.com/embed/${movieDetails.key}`}
            frameBorder="0"
            width="90%"
            height="90%"
            title='trailer'
            allowFullScreen
            allowTransparency
          ></iframe>
          <div className="player-info">
            <p>{movieDetails.published_at.slice(0,10)}</p>
            <p>{movieDetails.name}</p>
            <p>{movieDetails.type}</p>
          </div>
        </>
      )}
    </div >
  )
}

export default Player
