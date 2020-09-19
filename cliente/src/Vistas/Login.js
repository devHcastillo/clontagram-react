import React, { useState } from "react";

import Main from "../Componentes/Main";

export default function Login({ login }) {
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
      login(usuario.email, usuario.password);
    } catch (error) {
      console.log(error);
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
              No tienes cuenta? <a href="/signup">Signup</a>{" "}
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}
// const Login = () => {};
// export default Login()
