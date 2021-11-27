import React from "react";
import PropTypes from "prop-types";

const ListGroups = ({
  allGenres,
  currentGenre,
  onItemSelect,
  textProperty,
  valueProperty,
}) => {
  //console.log(allGenres);
  return (
    <div>
      <ul className="list-group">
        {/* <a
          onClick={() => {
            onItemSelect({ name: "All Genres" });
          }}
          className={
            currentGenre.name === "All Genres"
              ? "list-group-item  list-group-item-action active"
              : "list-group-item list-group-item-action"
          }
        >
          All Genres
        </a> */}

        {allGenres.map((item) => (
          <a
            key={item[valueProperty]}
            onClick={() => {
              onItemSelect(item);
            }}
            className={
              item.name === currentGenre.name
                ? "list-group-item  list-group-item-action active"
                : "list-group-item list-group-item-action"
            }
          >
            {item[textProperty]}
          </a>
        ))}
      </ul>
    </div>
  );
};

ListGroups.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

ListGroups.propTypes = {
  allGenres: PropTypes.array.isRequired,
  currentGenre: PropTypes.object.isRequired,
  onItemSelect: PropTypes.func.isRequired,
};

export default ListGroups;
