import axios, { type AxiosResponse } from 'axios';
import type { Movie } from '../types/movie';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface TmdbMovieDto {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface TmdbSearchResponse {
  results: TmdbMovieDto[];
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

  const response: AxiosResponse<TmdbSearchResponse> = await tmdbApi.get('/search/movie', {
    params: { query: normalizedQuery },
  });

  return response.data.results.map(item => ({
    id: item.id,
    poster_path: item.poster_path ?? '',
    backdrop_path: item.backdrop_path ?? '',
    title: item.title,
    overview: item.overview,
    release_date: item.release_date,
    vote_average: item.vote_average,
  }));
}
