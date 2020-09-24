import React, { useState, useEffect } from "react";
import Main from "../Componentes/Main";
import Loading from "../Componentes/Loading";
import Grid from "../Componentes/Grid";
import RecusoNoExiste from "../Componentes/RecursoNoExiste";
import Axios from "axios";
import stringToColor from "string-to-color";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import toggleSiguiendo from "../Helpers/amistad-helpers";

export default function Perfil({ mostrarError, usuario, match, logout }) {
  const username = match.params.username;
  const [usuarioDuenoDelPerfil, setUsuarioDuenoDelPerfil] = useState(null);
  const [posts, setPosts] = useState([]);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [perfilNoExiste, setPerfilNoExiste] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [enviandoAmistad, setEnviandoAmistad] = useState(false);

  useEffect(() => {
    async function cargarData() {
      try {
        setCargandoPerfil(true);
        const { data: usuario } = await Axios.get(`/api/usuarios/${username}`);
        const { data: posts } = await Axios.get(
          `/api/posts/usuario/${usuario._id}`
        );
        setUsuarioDuenoDelPerfil(usuario);
        setPosts(posts);
        setCargandoPerfil(false);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          setPerfilNoExiste(true);
        } else {
          mostrarError("Ocurrio un error al tratar de cargar el perfil");
        }
        setCargandoPerfil(false);
      }
    }

    cargarData();
  }, [username]);

  function esElPerfilDeLaPersonaLogin() {
    return usuario._id === usuarioDuenoDelPerfil._id;
  }

  async function handleImagenSeleccionada(e) {
    try {
      setSubiendoImagen(true);
      const file = e.target.files[0];
      const config = {
        headers: {
          "Content-type": file.type,
        },
      };

      const { data } = await Axios.post("/api/usuarios/upload", file, config);
      setUsuarioDuenoDelPerfil({ ...usuarioDuenoDelPerfil, imagen: data.url });
      setSubiendoImagen(false);
      console.log(data);
    } catch (error) {
      mostrarError(error.response.data);
      setSubiendoImagen(false);
      console.log(error);
    }
  }

  async function onToggleSiguiendo() {
    if (enviandoAmistad) {
      return;
    }

    try {
      setEnviandoAmistad(true);
      const usuarioActualizado = await toggleSiguiendo(usuarioDuenoDelPerfil);
      setUsuarioDuenoDelPerfil(usuarioActualizado);
      setEnviandoAmistad(false);
    } catch (error) {
      setEnviandoAmistad(false);
      mostrarError("Error al tratar de siguir a este usuario");
      console.log(error);
    }
  }

  if (cargandoPerfil) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (perfilNoExiste) {
    return (
      <RecusoNoExiste mensaje="El perfil que estas tratando de ver no existe"></RecusoNoExiste>
    );
  }

  if (usuario == null) {
    return;
  }

  return (
    <Main>
      <div className="Perfil">
        <ImagenAvatar
          esElPerfilDeLaPersonaLogin={esElPerfilDeLaPersonaLogin}
          usuarioDuenoDelPerfil={usuarioDuenoDelPerfil}
          handleImagenSeleccionada={handleImagenSeleccionada}
          subiendoImagen={subiendoImagen}
        />
        <div className="Perfil__bio-container">
          <div className="Perfil__bio-heading">
            <h2 className="capitalize">{usuarioDuenoDelPerfil.username}</h2>
            {!esElPerfilDeLaPersonaLogin() && (
              <BotonSeguir
                siguiendo={usuarioDuenoDelPerfil.siguiendo}
                toggleSiguiendo={onToggleSiguiendo}
              />
            )}
            {esElPerfilDeLaPersonaLogin() && <BotonLogout logout={logout} />}
          </div>
          <DescripcionPerfil
            usuarioDuenoDelPerfil={usuarioDuenoDelPerfil}
          ></DescripcionPerfil>
        </div>
      </div>
    </Main>
  );
}

function ImagenAvatar({
  esElPerfilDeLaPersonaLogin,
  usuarioDuenoDelPerfil,
  handleImagenSeleccionada,
  subiendoImagen,
}) {
  let contenido;
  if (subiendoImagen) {
    contenido = <Loading />;
  } else if (esElPerfilDeLaPersonaLogin) {
    contenido = (
      <label
        className="Perfil__img-placeholder Perfil__img-placeholder--pointer"
        style={{
          backgroundImage: usuarioDuenoDelPerfil.imagen
            ? `url(${usuarioDuenoDelPerfil.imagen})`
            : null,
          backgroundColor: stringToColor(usuarioDuenoDelPerfil.username),
        }}
      >
        <input
          type="file"
          onChange={handleImagenSeleccionada}
          className="hidden"
          name="imagen"
        ></input>
      </label>
    );
  } else {
    contenido = (
      <div
        className="Perfil__img-placeholder"
        style={{
          backgroundImage: usuarioDuenoDelPerfil.imagen
            ? `url(${usuarioDuenoDelPerfil.imagen})`
            : null,
          backgroundColor: stringToColor(usuarioDuenoDelPerfil.username),
        }}
      ></div>
    );
  }

  return <div className="Perfil__img-container">{contenido}</div>;
}

function BotonSeguir({ siguiendo, toggleSiguiendo }) {
  return (
    <button onClick={toggleSiguiendo} className="Perfil__boton-seguir">
      {siguiendo ? "Dejar de seguir" : "Seguir"}
    </button>
  );
}

function BotonLogout({ logout }) {
  return (
    <button onClick={logout} className="Perfil__boton-logout">
      Logout
    </button>
  );
}

function DescripcionPerfil({ usuarioDuenoDelPerfil }) {
  return (
    <div className="Perfil__descripcion">
      <h2 className="Perfil_nombre">{usuarioDuenoDelPerfil.nombre}</h2>
      <p>{usuarioDuenoDelPerfil.bio}</p>
      <p className="Perfil__estadisticas">
        <b>{usuarioDuenoDelPerfil.numSiguiendo}</b> following
        <span className="ml-4">
          <b>{usuarioDuenoDelPerfil.numSeguidores}</b> follewers
        </span>
      </p>
    </div>
  );
}
