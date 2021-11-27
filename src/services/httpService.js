import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.response.use(
  function (response) {
    //console.log(response);

    return response;
  },
  (error) => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    //toast.error(error.response.status + "MovieService");
    if (!expectedError) {
      console.log("Logging error", error);
      toast.error("An unexpected error occurred");
    }

    return Promise.reject(error);
  }
);

function setJWT(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJWT,
};
