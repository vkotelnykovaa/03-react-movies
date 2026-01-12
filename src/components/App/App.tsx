import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import type { Movie } from '../../types/movie';
import styles from './App.module.css';



function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = async (query: string) => {
    setMovies([]);
    setSelectedMovie(null);
    setHasError(false);
    setIsLoading(true);

    try {
      const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

   const response = await axios.get(
  'https://api.themoviedb.org/3/search/movie',
  {
    params: { query },
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  }
);

      const results: Movie[] = (response.data.results as unknown[]).map(item => {
        const movie = item as Movie;

        return {
          id: movie.id,
          poster_path: movie.poster_path ?? '',
          backdrop_path: movie.backdrop_path ?? '',
          title: movie.title,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        };
      });

      if (results.length === 0) {
        toast('No movies found for your request.');
        return;
      }

      setMovies(results);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading ? (
        <Loader />
      ) : hasError ? (
        <ErrorMessage />
      ) : movies.length > 0 ? (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      ) : null}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
}

export default App;
