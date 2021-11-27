import React from "react";
import { useState } from "react/cjs/react.development";
import Input from "./common/input";
import Joi from "joi-browser";
import { login } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import useToken from "../hooks/useToken";

const LoginForm = () => {
  let location = useLocation();
  let userAuth = "";
  const { token, setToken } = useToken();

  const [inputDetails, setInputDetails] = useState({
    username: "",
    password: "",
  });

  const schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };
  const [errors, setErrors] = useState({});

  const validate = () => {
    const result = Joi.validate(inputDetails, schema, { abortEarly: false });

    if (!result.error) return null;

    const valErrors = {};

    for (let item of result.error.details) {
      valErrors[item.path[0]] = item.message;
    }

    console.log(valErrors, "validate");
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

    if (validationErrors) return;

    //call the server
    try {
      userAuth = await login(inputDetails.username, inputDetails.password);
      console.log(userAuth, "JWT");
      setToken(userAuth);
      window.location = location.state ? location.state.path : "/";

      //handleLogin(inputDetails.username, inputDetails.password);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const _errors = { ...errors };
        _errors.username = ex.response.data;
        console.log(ex.response.data);
        setErrors(_errors);
      }
    }

    console.log("Submitted");
  };

  const validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const subSchema = { [input.name]: schema[input.name] };
    const { error } = Joi.validate(obj, subSchema);

    return error ? error.details[0].message : null;
  };
  const handleChange = (e) => {
    const account = { ...inputDetails };

    const propertyErrors = { ...errors };
    const error = validateProperty(e.currentTarget);

    console.log(error, "validateProperty");
    if (error) propertyErrors[e.currentTarget.name] = error;
    else delete propertyErrors[e.currentTarget.name];
    //console.log(e);
    account[e.currentTarget.name] = e.currentTarget.value;

    setInputDetails(account);
    setErrors(propertyErrors);
  };
  //console.log(inputDetails);
  return (
    <div>
      <h1>Login</h1>
      <Input
        type="text"
        name="username"
        label="Username"
        value={inputDetails.username}
        onChange={handleChange}
        error={errors.username}
      />
      <Input
        type="password"
        name="password"
        label="Password"
        value={inputDetails.password}
        onChange={handleChange}
        error={errors.password}
      />
      <form onSubmit={handleSubmit}>
        <button disabled={validate()} className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
