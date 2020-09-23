import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Axios from "axios";
import {
  setToken,
  deleteToken,
  getToken,
  initAxiosInterceptors,
} from "./Helpers/auth-helpers";

//Componentes
import Nav from "./Componentes/Nav";
import Main from "./Componentes/Main";
import Loading from "./Componentes/Loading";
import Error from "./Componentes/Error";

//Vistas
import Signup from "./Vistas/Signup";
import Login from "./Vistas/Login";
import Upload from "./Vistas/Upload";
import Feed from "./Vistas/Feed";
import Post from "./Vistas/PostVista";
import Explore from "./Vistas/Explore";

initAxiosInterceptors();

export default function App() {
  const [usuario, setUsuario] = useState(null); //Userstate
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarUsuario() {
      if (!getToken()) {
        setCargandoUsuario(false);
        return;
      }

      try {
        const { data: usuario } = await Axios.get("/api/usuarios/whoami");
        setUsuario(usuario);
        setCargandoUsuario(false);
      } catch (error) {
        console.log(error);
      }
    }

    cargarUsuario();
  }, []);

  const login = async (email, password) => {
    const { data } = await Axios.post("/api/usuarios/login", {
      email,
      password,
    });
    setUsuario(data.usuario);
    setToken(data.token);
  };

  async function signup(usuario) {
    const { data } = await Axios.post("api/usuarios/signup", usuario);
    setUsuario(data.usuario);
    setToken(data.token);
  }

  const logout = () => {
    setUsuario(null);
    deleteToken();
  };

  function mostrarError(message) {
    setError(message);
  }
  function esconderError() {
    setError(null);
  }

  if (cargandoUsuario) {
    return (
      <Main center={true}>
        <Loading />
      </Main>
    );
  }

  return (
    <Router>
      <Nav usuario={usuario} />
      <Error mensaje={error} esconderError={esconderError} />
      {usuario ? (
        <LoginRoutes mostrarError={mostrarError} usuario={usuario} />
      ) : (
        <LogoutRoutes
          login={login}
          signup={signup}
          mostrarError={mostrarError}
        />
      )}
    </Router>
  );
}

function LoginRoutes({ mostrarError, usuario }) {
  return (
    <Switch>
      <Route
        path="/upload/"
        render={(props) => <Upload {...props} mostrarError={mostrarError} />}
      ></Route>

      <Route
        path="/post/:id"
        render={(props) => (
          <Post {...props} mostrarError={mostrarError} usuario={usuario} />
        )}
      ></Route>

      <Route
        path="/explore"
        render={(props) => <Explore {...props} mostrarError={mostrarError} />}
      ></Route>

      <Route
        path="/"
        render={(props) => (
          <Feed {...props} mostrarError={mostrarError} usuario={usuario} />
        )}
        default
      ></Route>
    </Switch>
  );
}

function LogoutRoutes({ login, signup, mostrarError }) {
  return (
    <Switch>
      <Route
        path="/login/"
        render={(props) => (
          <Login {...props} login={login} mostrarError={mostrarError} />
        )}
      ></Route>
      <Route
        render={(props) => (
          <Signup {...props} signup={signup} mostrarError={mostrarError} />
        )}
        default
      ></Route>
    </Switch>
  );
}
