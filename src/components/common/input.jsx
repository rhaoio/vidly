import React from "react";

const Input = ({ name, label, value, error, type, data, onChange }) => {
  return (
    <React.Fragment>
      {type === "search" && (
        <div className="form-group">
          <input
            value={value}
            onChange={onChange}
            id={name}
            name={name}
            type={type}
            className="form-control"
            placeholder="Search..."
          />
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      )}
      {(type === "text" || type === "password" || type === "name") && (
        <div className="form-group">
          <label htmlFor={name}>{label}</label>

          <input
            value={value}
            onChange={onChange}
            id={name}
            name={name}
            type={type}
            className="form-control"
          />
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      )}
      {type === "dropdown" && (
        <div className="form-group">
          <label htmlFor="exampleFormControlSelect1">{label}</label>
          <select
            onChange={onChange}
            value={value}
            name={name}
            className="form-select"
            id={name}
            aria-label="Default select example"
          >
            {data.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </React.Fragment>
  );
};

export default Input;
