import http from "./httpService";
import config from "../config/config.json";
import { getGenres } from "./genreService";

const movieEndpoint = config.moviesEndpoint;

export function getMovies() {
  const movies = http.get(movieEndpoint);

  return movies;
}

export async function getMovie(id) {
  const movie = await http.get(movieEndpoint + id);

  return movie;
}

export async function saveMovie(movie, movieId) {
  //console.log(movie.genre[0]._id);

  const response = await getMovies();
  //console.log(response, "movieService - AllMovies");
  let movieInDb = response.data.find((m) => m._id === movie._id) || {};

  console.log(movieId, "MovieSelected");

  const genres = await getGenres();
  movieInDb.title = movie.title;
  movieInDb.genreId = genres.data.find((g) => g._id === movie.genreId)._id;
  movieInDb.numberInStock = movie.numberInStock;
  movieInDb.dailyRentalRate = movie.dailyRentalRate;

  if (!movieId) {
    await http.post(movieEndpoint, movieInDb);
  } else {
    await http.put(movieEndpoint + movieId, movieInDb);
  }

  return movieInDb;
}

export async function deleteMovie(id) {
  const currentMovies = await getMovies();

  let movieInDb = currentMovies.data.find((m) => m._id === id);
  //movies.splice(movies.indexOf(movieInDb), 1);
  await http.delete(movieEndpoint + id);
  return movieInDb;
}
