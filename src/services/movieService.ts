import axios, { type AxiosResponse } from 'axios';
import type { Movie } from '../types/movie';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

type TmdbMovieDto = Omit<Movie, 'poster_path' | 'backdrop_path'> & {
  poster_path: Movie['poster_path'] | null;
  backdrop_path: Movie['backdrop_path'] | null;
};

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

  const results: Movie[] = response.data.results.map(
    ({ poster_path, backdrop_path, ...rest }): Movie => ({
      ...rest,
      poster_path: poster_path ?? '',
      backdrop_path: backdrop_path ?? '',
    })
  );

  return results;
}
