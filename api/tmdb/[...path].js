const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const CACHE_CONTROL = 's-maxage=300, stale-while-revalidate=600';
const REQUEST_TIMEOUT_MS = 10000;

const isAllowedPath = (path) => {
  return (
    /^movie\/(now_playing|top_rated|popular|upcoming)$/.test(path) ||
    /^movie\/\d+\/videos$/.test(path) ||
    path === 'search/movie'
  );
};

const sendJson = (res, status, data) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json(data);
};

const getRequestedPath = (req, url) => {
  const pathParam = req.query?.path;

  if (Array.isArray(pathParam)) {
    return pathParam.join('/');
  }

  if (typeof pathParam === 'string') {
    return pathParam;
  }

  return url.pathname.replace(/^\/api\/tmdb\/?/, '');
};

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const fetchTmdbWithRetry = async (url, options, retries = 1) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await wait(400);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const tmdbBearerToken = process.env.TMDB_BEARER_TOKEN;

  if (!tmdbBearerToken) {
    sendJson(res, 500, { error: 'TMDB server configuration is missing' });
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  const path = getRequestedPath(req, url);

  if (!isAllowedPath(path)) {
    sendJson(res, 404, { error: 'TMDB endpoint is not allowed' });
    return;
  }

  const tmdbUrl = new URL(`${TMDB_BASE_URL}/${path}`);
  url.searchParams.delete('path');
  url.searchParams.forEach((value, key) => {
    tmdbUrl.searchParams.set(key, value);
  });

  try {
    const tmdbResponse = await fetchTmdbWithRetry(tmdbUrl, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${tmdbBearerToken}`,
      },
    });

    const data = await tmdbResponse.text();

    res.setHeader('Cache-Control', CACHE_CONTROL);
    res.setHeader('Content-Type', tmdbResponse.headers.get('content-type') || 'application/json; charset=utf-8');
    res.status(tmdbResponse.status).send(data);
  } catch (error) {
    const reason = error?.cause?.code || error?.name || error?.message || 'unknown';
    console.warn(`TMDB API request failed: ${reason}`);
    sendJson(res, 502, { error: 'TMDB request failed. Please try again.' });
  }
}
