import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="navbar-brand" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/movies">
              Movies
            </NavLink>
          </li>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/customers">
              Customers
            </NavLink>
          </li>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/rentals">
              Rentals
            </NavLink>
          </li>
          {Object.keys(props.user).length === 0 && (
            <React.Fragment>
              <li className="nav-item active">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
              <li className="nav-item active">
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </li>
            </React.Fragment>
          )}
          {Object.keys(props.user).length > 0 && (
            <React.Fragment>
              <li className="nav-item active">
                <NavLink className="nav-link" to="/profile">
                  {props.user.name}
                </NavLink>
              </li>
              <li className="nav-item active">
                <NavLink className="nav-link" to="/logout">
                  Logout
                </NavLink>
              </li>
            </React.Fragment>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
