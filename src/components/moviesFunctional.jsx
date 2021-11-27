import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import { useNavigate } from "react-router-dom";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroups from "./common/listgroup";
import Input from "./common/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";

const Movies2 = (props) => {
  let navigate = useNavigate();

  const user = props.user;

  const [movies, setMovies] = useState([]);
  const [pageSize, setPagesize] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [genres, setGenres] = useState([{ _id: "", name: "All Genres" }]);
  const [activeGenre, setActiveGenre] = useState({
    _id: "",
    name: "All Genres",
  });
  const [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" });
  const [searchField, setSearchField] = useState("");

  useEffect(() => {
    async function getAllGenres() {
      const response = await getGenres();
      setGenres([{ _id: "", name: "All Genres" }, ...response.data]);
    }
    async function getAllMovies() {
      const response = await getMovies();
      setMovies(response.data);
    }
    getAllGenres();
    getAllMovies();
  }, []);

  const handleDelete = async (movie) => {
    const origMovies = [...movies];
    const _movies = movies.filter((m) => m._id !== movie._id);
    setMovies(_movies);

    try {
      await deleteMovie(movie._id);
      toast.info("Successfully deleted movie");
    } catch (ex) {
      console.log("HANDLE DELETE CATCH BLOCK");
      if (ex.response && ex.response.status === 404) {
        toast.error("Movie Not Found");
      }

      setMovies(origMovies);
    }
    //
  };

  const handleLike = (movie) => {
    //console.log("Like Clicked");
    const newMovies = [...movies];
    const index = newMovies.indexOf(movie);
    newMovies[index] = { ...newMovies[index] };
    newMovies[index].liked = !newMovies[index].liked;

    setMovies(newMovies);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleItemSelect = (item) => {
    //console.log(item);
    setActiveGenre(item);
    setCurrentPage(1);
  };
  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleAddMovie = () => {
    navigate("/movies/new");
  };

  const handleSearch = (e) => {
    setSearchField(e.currentTarget.value);
    //reset genre to all
    setActiveGenre({ _id: "", name: "All Genres" });
    //update columns to show, update movies to show in movietable

    setCurrentPage(1); //Set page to first page
  };

  const getPagedData = () => {
    const filtered =
      activeGenre && activeGenre._id
        ? movies.filter((m) => m.genre._id === activeGenre._id)
        : movies;
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    let searched = [...sorted];
    if (searchField !== "") {
      searched = searched.filter((m) =>
        m.title.toLowerCase().startsWith(searchField)
      );
    }

    const paginatedMovies = paginate(searched, currentPage, pageSize);

    return { totalCount: searched.length, data: paginatedMovies };
  };

  const { totalCount, data: paginatedMovies } = getPagedData();

  return (
    <div>
      <React.Fragment>
        <ToastContainer />
        <div className="row">
          <div className="col-2">
            <ListGroups
              allGenres={genres}
              currentGenre={activeGenre}
              onItemSelect={handleItemSelect}
            />
          </div>
          <div className="col">
            {Object.keys(user).length > 0 && (
              <button
                onClick={handleAddMovie}
                className="btn btn-primary btn-sm"
              >
                Add Movie
              </button>
            )}
            <p>Displaying {totalCount} movies from the database.</p>
            <Input
              type="search"
              name="Search"
              label="Search"
              value={searchField}
              onChange={handleSearch}
            />
            <MoviesTable
              movies={paginatedMovies}
              onLike={handleLike}
              onDelete={handleDelete}
              onSort={handleSort}
              sortColumn={sortColumn}
            />
            <div>
              <Pagination
                itemsCount={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default Movies2;
