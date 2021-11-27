import React from "react";
import { useEffect, useState } from "react/cjs/react.development";
import Input from "./common/input";
import Joi from "joi-browser";
import { saveMovie, getMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AddMovie = () => {
  let navigate = useNavigate();
  let params = useParams();
  let location = useLocation();

  const [genres, setGenres] = useState([]);
  const [inputDetails, setInputDetails] = useState({
    title: "",
    genreId: "",
    numberInStock: "",
    dailyRentalRate: "",
  });

  useEffect(() => {
    async function getAllGenres() {
      const response = await getGenres();
      setGenres(response.data);
      setInputDetails({ ...inputDetails, genreId: response.data[0]._id });
    }
    getAllGenres();
  }, []);

  const [errors, setErrors] = useState({});
  //find if there has been a movie that is clicked on first, to populate the form with
  //if it doesnt exist, redirect to 'Not Found'
  //if we came from new, then populate with default data

  //default field entries here

  useEffect(() => {
    if (location.pathname === "/movies/new") {
      return;
    }

    async function getCurrentMovie(movieId) {
      try {
        const response = await getMovie(movieId);
        const movie = response.data[0];
        setInputDetails({
          ...inputDetails,

          title: movie.title,
          genreId: movie.genre._id,
          numberInStock: movie.numberInStock,
          dailyRentalRate: movie.dailyRentalRate,
        });
      } catch (ex) {
        navigate("/not-found", { replace: true });
      }
    }

    getCurrentMovie(params.id);
  }, []);

  const schema = {
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().min(0).required().label("Number in Stock"),
    dailyRentalRate: Joi.number().required().min(1).max(10).label("Rate"),
  };

  const validate = () => {
    const result = Joi.validate(inputDetails, schema, { abortEarly: false });

    if (!result.error) return null;

    const valErrors = {};

    for (let item of result.error.details) {
      valErrors[item.path[0]] = item.message;
    }

    console.log(valErrors);
    return valErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (validationErrors === null) {
      setErrors({});
    } else {
      setErrors(validationErrors);
    }

    console.log(validationErrors, "validation errors");
    if (validationErrors) return;

    const _movieToAdd = { ...inputDetails };

    try {
      await saveMovie(_movieToAdd, params.id);
      toast.info("Successfully added a movie");
    } catch (ex) {
      if (ex.response && ex.response.status !== 201) {
        toast.error("Error, movie not added");
      }
    }

    navigate("/movies");
  };

  const validateProperty = (input) => {
    if (input.name) {
      const obj = { [input.name]: input.value };
      const subSchema = { [input.name]: schema[input.name] };
      const { error } = Joi.validate(obj, subSchema);

      return error ? error.details[0].message : null;
    } else {
      return null;
    }
  };
  const handleChange = (e) => {
    const movieDetails = { ...inputDetails };

    const propertyErrors = { ...errors };
    const error = validateProperty(e.currentTarget);

    if (error) propertyErrors[e.currentTarget.name] = error;
    else delete propertyErrors[e.currentTarget.name];

    movieDetails[e.currentTarget.name] = e.currentTarget.value;

    setInputDetails(movieDetails);
    setErrors(propertyErrors);
  };

  return (
    <div>
      <h1>MovieForm</h1>
      <Input
        type="text"
        name="title"
        label="Title"
        value={inputDetails.title}
        onChange={handleChange}
        error={errors.title}
      />
      <Input
        type="dropdown"
        name="genreId"
        label="Genre"
        value={inputDetails.genreId}
        onChange={handleChange}
        error={errors.genreId}
        data={genres}
      />
      <Input
        type="text"
        name="numberInStock"
        label="Number In Stock"
        value={inputDetails.numberInStock}
        onChange={handleChange}
        error={errors.numberInStock}
      />
      <Input
        type="text"
        name="dailyRentalRate"
        label="Rate"
        value={inputDetails.dailyRentalRate}
        onChange={handleChange}
        error={errors.dailyRentalRate}
      />
      <form onSubmit={handleSubmit}>
        <button disabled={validate()} className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
