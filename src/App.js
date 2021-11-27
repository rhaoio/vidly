import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Movies2 from "./components/moviesFunctional";
import AddMovie from "./components/addmovie";
import NavBar from "./components/navbar";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notfound";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Logout from "./components/logout";
import { useEffect, useState, useContext } from "react";
import RequireAuth from "./components/requireAuth";
import { getCurrentUser } from "./services/authService";
import useToken from "./hooks/useToken";

function App() {
  const [user, setUser] = useState({});
  const { token, setToken } = useToken();

  useEffect(() => {
    const decodedJwt = getCurrentUser();

    setUser(decodedJwt);
  }, []);

  console.log(token, "Token");

  return (
    <main className="container">
      <NavBar user={user} />

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/movies">
          <Route
            path=":id"
            user={user}
            element={
              <RequireAuth redirectTo="/login" user={token}>
                <AddMovie />
              </RequireAuth>
            }
          />
          <Route path="/movies/new" element={<AddMovie />}></Route>
          <Route path="" element={<Movies2 user={user} />}></Route>
        </Route>

        <Route path="/customers" element={<Customers />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/movies" element={<Movies2 user={user} />} />
        <Route path="/" element={<Movies2 user={user} />} />
        <Route path="*" element={<Navigate to="not-found" />} />
      </Routes>
    </main>
  );
}

export default App;
