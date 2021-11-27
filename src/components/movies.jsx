import React, { Component } from "react";
import { getMovies } from "../services/movieService";
import { getGenres } from "../services/genreService";
import MoviesTable from "./moviesTable";

import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroups from "./common/listgroup";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    genres: [],
    activeGenre: { _id: "", name: "All Genres" },
    sortColumn: { path: "title", order: "asc" },
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres: genres });
  }

  handleDelete = (movie) => {
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({
      movies: movies,
    });
  };

  handleLike = (movie) => {
    //console.log("Like Clicked");
    const newMovies = [...this.state.movies];
    const index = newMovies.indexOf(movie);
    newMovies[index] = { ...newMovies[index] };
    newMovies[index].liked = !newMovies[index].liked;

    this.setState({
      movies: newMovies,
    });
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handleItemSelect = (item) => {
    //console.log(item);
    this.setState({ activeGenre: item, currentPage: 1 });
  };
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleAddMovie = () => {
    // let navigate = useNavigate();
    // navigate("/movies/new");
  };

  getPagedData = () => {
    const { pageSize, currentPage, movies, activeGenre, sortColumn } =
      this.state;
    const filtered =
      activeGenre && activeGenre._id
        ? movies.filter((m) => m.genre._id === activeGenre._id)
        : movies;
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const paginatedMovies = paginate(sorted, currentPage, pageSize);
    console.log(paginatedMovies);
    return { totalCount: filtered.length, data: paginatedMovies };
  };

  render() {
    const { pageSize, currentPage, movies, activeGenre, sortColumn } =
      this.state;

    if (this.state.movies.length === 0) {
      return this.movieNumber();
    }
    const { totalCount, data: paginatedMovies } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-2">
          <ListGroups
            allGenres={this.state.genres}
            currentGenre={this.state.activeGenre}
            onItemSelect={this.handleItemSelect}
          />
        </div>
        <div className="col">
          <button
            onClick={this.handleAddMovie}
            className="btn btn-primary btn-sm"
          >
            Add Movie
          </button>
          <p>Displaying {totalCount} movies from the database.</p>

          <MoviesTable
            movies={paginatedMovies}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            sortColumn={sortColumn}
          />
          <div>
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              onPageChange={this.handlePageChange}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    );
  }

  movieNumber() {
    let message = "";

    if (this.state.movies.length > 0) {
      message =
        "Showing " + this.state.movies.length + " movies from the database.";
    } else {
      message = <h1>"There are no movies in the database."</h1>;
    }

    return message;
  }
}

export default Movies;
