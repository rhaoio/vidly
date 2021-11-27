import React from "react";
import { useState } from "react/cjs/react.development";
import Input from "./common/input";
import Joi from "joi-browser";
import * as userService from "../services/userService";
import { loginWithJwt } from "../services/authService";

const RegisterForm = () => {
  const [inputDetails, setInputDetails] = useState({
    username: "",
    password: "",
    name: "",
  });

  const schema = {
    username: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .label("Email"),
    password: Joi.string().min(5).required().label("Password"),
    name: Joi.string().required().label("Name"),
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
      const response = await userService.register(inputDetails);

      loginWithJwt(response.headers["x-auth-token"]);

      window.location = "/";
      console.log(response);
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
      <h1>Register</h1>
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
      <Input
        type="name"
        name="name"
        label="Name"
        value={inputDetails.name}
        onChange={handleChange}
        error={errors.name}
      />
      <form onSubmit={handleSubmit}>
        <button disabled={validate()} className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
