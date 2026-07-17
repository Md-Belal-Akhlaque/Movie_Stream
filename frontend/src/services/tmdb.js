const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;

const requestTmdb = async (path, searchParams = {}) => {
  const url = new URL(`${TMDB_BASE_URL}/${path}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_BEARER_TOKEN}`
    }
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
  }

  return response.json();
};

export const getMoviesByCategory = (category = 'now_playing') => {
  return requestTmdb(`movie/${category}`, {
    language: 'en-US',
    page: '1',
  });
};

export const searchMovies = (query) => {
  return requestTmdb('search/movie', {
    query,
    include_adult: 'false',
    language: 'en-US',
    page: '1',
  });
};

export const getMovieVideos = (movieId) => {
  return requestTmdb(`movie/${movieId}/videos`, {
    language: 'en-US',
  });
};