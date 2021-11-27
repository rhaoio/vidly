import React, { useState } from "react";

const useToken = () => {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    console.log("GETTING TOKEN");
    //const userToken = JSON.parse(tokenString);
    return tokenString;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (token) => {
    localStorage.setItem("token", token);
    console.log("SETTING TOKEN");
    setToken(token);
  };
  return {
    setToken: saveToken,
    token,
  };
};

export default useToken;
