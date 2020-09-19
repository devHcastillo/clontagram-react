import React, { useState } from "react";
import { Link } from "react-router-dom";

import Main from "../Componentes/Main";

export default function Login({ login, mostrarError }) {
  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(usuario.email, usuario.password);
    } catch (error) {
      console.log(error.response.data)
      mostrarError(error.response.data.message)
    }
  };

  return (
    <Main center={true}>
      <div className="FormContainer">
        <h1 className="Form_titulo">Clontagram</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              className="Form__field"
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleInputChange}
              value={usuario.email}
            />

            <input
              className="Form__field"
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleInputChange}
              value={usuario.password}
            />

            <button className="Form__submit" type="submit">
              Login
            </button>
            <p className="FormContainer__info">
              No tienes cuenta? <Link to="/signup">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}
// const Login = () => {};
// export default Login()
