import config from "../config/config.json";
import http from "./httpService";

const genreEndpoint = config.genresEndpoint;

export async function getGenres() {
  //console.log(genreEndpoint, "GenreEndpoint");
  const genres = await http.get(genreEndpoint);

  return genres;
}
