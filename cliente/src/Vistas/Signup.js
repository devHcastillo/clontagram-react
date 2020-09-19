import React, { useState } from "react";

import Main from "../Componentes/Main";
import SignupImage from "../imagenes/signup.png";

export default function Signup({ signup }) {
  const [usuario, setUsuario] = useState({
    email: "",
    username: "",
    nombre: "",
    bio: "",
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
      signup(usuario);
    } catch (error) {}
  };

  return (
    <div>
      <Main center={true}>
        <div className="Signup">
          <img src={SignupImage} alt="signup" className="Signup__img"></img>
        </div>
        <div className="FormContainer">
          <h1 className="Form__titulo">Clontagram</h1>
          <p className="FormContainer__info">
            Registrate para que veas el clon de Instagram
          </p>
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
              type="text"
              name="nombre"
              placeholder="Nombre y Apellido"
              minLength="3"
              maxLength="100"
              required
              onChange={handleInputChange}
              value={usuario.nombre}
            />

            <input
              className="Form__field"
              type="text"
              name="username"
              placeholder="Username"
              minLength="3"
              maxLength="30"
              required
              onChange={handleInputChange}
              value={usuario.username}
            />
            <input
              className="Form__field"
              type="text"
              name="bio"
              placeholder="Cuentanos de ti..."
              minLength="3"
              maxLength="150"
              required
              onChange={handleInputChange}
              value={usuario.bio}
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
              Sign up
            </button>
            <p className="FormContainer__info">
              Ya tienes una cuenta? <a href="/login">login</a>{" "}
            </p>
          </form>
        </div>
      </Main>
    </div>
  );
}
