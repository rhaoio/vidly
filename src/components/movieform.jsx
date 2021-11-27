import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const MovieForm = (props) => {
  let params = useParams();
  let navigate = useNavigate();

  console.log(params);

  const handleSave = () => {
    //Save behavior
    navigate("/");
  };

  return (
    <div>
      <h1>Movie Id of {params.id}</h1>
      <button onClick={handleSave} className="btn btn-primary btn-sm">
        Save
      </button>
    </div>
  );
};

export default MovieForm;
