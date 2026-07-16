const requestTmdb = async (path, searchParams = {}) => {
  const url = new URL(`/api/tmdb/${path}`, window.location.origin);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON from TMDB proxy, received ${contentType || 'unknown content type'}`);
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
