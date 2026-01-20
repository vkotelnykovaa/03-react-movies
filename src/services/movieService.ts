import axios from 'axios';
import type { Movie } from '../types/movie';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface TmdbSearchResponse {
  results: Movie[];
}

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    accept: 'application/json',
  },
});

export async function fetchMovies(query: string): Promise<Movie[]> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];

  const response = await tmdbApi.get<TmdbSearchResponse>(
    '/search/movie',
    {
      params: { query: normalizedQuery },
    }
  );

  return response.data.results.map(movie => ({
    ...movie,
    poster_path: movie.poster_path ?? '',
    backdrop_path: movie.backdrop_path ?? '',
  }));
}
