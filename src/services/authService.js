import http from "./httpService";
import config from "../config/config.json";
import jwtDecode from "jwt-decode";

const authEndpoint = config.authEndpoint;
const tokenKey = "token";

http.setJWT(getJWT());

export async function login(email, password) {
  const { data: jwt } = await http.post(authEndpoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
  return jwt;
}

export async function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getJWT() {
  return localStorage.getItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    const _user = jwtDecode(jwt);
    console.log(_user, "currentUser");
    return _user;
  } catch (ex) {
    const _ = {};
    return _;
  }
}
