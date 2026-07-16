import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const isAllowedTmdbPath = (path) => {
  return (
    /^movie\/(now_playing|top_rated|popular|upcoming)$/.test(path) ||
    /^movie\/\d+\/videos$/.test(path) ||
    path === 'search/movie'
  );
};

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const fetchTmdbWithRetry = async (url, options, retries = 1) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

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

const tmdbDevProxy = (tmdbBearerToken) => ({
  name: 'tmdb-dev-proxy',
  configureServer(server) {
    server.middlewares.use('/api/tmdb', async (req, res) => {
      if (req.method !== 'GET') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      if (!tmdbBearerToken) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'TMDB server configuration is missing' }));
        return;
      }

      const requestUrl = new URL(req.url, 'http://localhost');
      const path = requestUrl.pathname.replace(/^\/?/, '');

      if (!isAllowedTmdbPath(path)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'TMDB endpoint is not allowed' }));
        return;
      }

      const tmdbUrl = new URL(`${TMDB_BASE_URL}/${path}`);
      requestUrl.searchParams.forEach((value, key) => {
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

        res.statusCode = tmdbResponse.status;
        res.setHeader('Content-Type', tmdbResponse.headers.get('content-type') || 'application/json');
        res.end(data);
      } catch {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'TMDB request failed. Please try again.' }));
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tmdbDevProxy(env.TMDB_BEARER_TOKEN),
    ],
  };
})
