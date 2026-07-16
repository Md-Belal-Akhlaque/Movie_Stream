import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
// import cards_data from '../../assets/cards/Cards_data'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../Loading/Loading'
import { getMoviesByCategory } from '../../services/tmdb'


const TitleCards = ({ title, category }) => {

  const [apiData, setApiData] = useState([]);
  const [status, setStatus] = useState('loading');
  const cardRef = useRef();

  useEffect(() => {
    setStatus('loading');

    getMoviesByCategory(category)
      .then(res => {
        setApiData(res.results || []);
        setStatus('loaded');
      })
      .catch(err => {
        console.error(err);
        setApiData([]);
        setStatus('error');
        toast.error('Could not load movies. Please try again.', {
          toastId: 'movies-load-error'
        });
      });
  }, [category])

  useEffect(() => {
    const cardList = cardRef.current;

    if (!cardList) {
      return;
    }

    const handleWheel = (e) => {
      e.preventDefault();
      cardList.scrollLeft += e.deltaY;
    };

    cardList.addEventListener('wheel', handleWheel);

    return () => {
      cardList.removeEventListener('wheel', handleWheel);
    };
  }, [])


  return (
    <div className='title-cards'>
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardRef}>
        {status === 'loading' && <Loading text='Loading movies...' variant='inline' />}
        {status === 'error' && <p className='cards-message'>Unable to load movies right now.</p>}
        {/* //yahapar card_data ko hata kar apiData use karo */}
        {status === 'loaded' && apiData.map((card, index) => {
          //url is from searching img url of tmdb on internet
          const cardImg = "https://image.tmdb.org/t/p/w500" + card.poster_path;
          const cardName = card.original_title;

          return (<Link to={`/player/${card.id}`} className="card" key={index}>
            <img src={cardImg} alt="" />
            <span>{cardName}</span>
          </Link>)
        })}
      </div>
    </div>
  )
}

export default TitleCards
