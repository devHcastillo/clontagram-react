import React, { useState } from "react";
import Main from "../Componentes/Main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Componentes/Loading";
import Axios from "axios";

export default function Upload({ history, mostrarError }) {
  const [imagenUrl, setImagenUrl] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [enviandoPost, setEnviendoPost] = useState(false);
  const [caption, setCaption] = useState("");
  const handleImageSelected = async (e) => {
    try {
      setSubiendoImagen(true);
      const file = e.target.files[0];
      const config = {
        headers: {
          "Content-Type": file.type,
        },
      };

      const { data } = await Axios.post("api/posts/upload", file, config);
      console.log(data)
      setImagenUrl(data.url);
      setSubiendoImagen(false);
    } catch (error) {
      setSubiendoImagen(false);
      mostrarError(error.response.data);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (enviandoPost) {
      return;
    }

    if (subiendoImagen) {
      mostrarError("No se ha terminado de subir la imagen");
      return;
    }

    if (!imagenUrl) {
      mostrarError("Primero selecciona una imagen");
      return;
    }

    try {
      setEnviendoPost(true);
      const body = { caption, url: imagenUrl };
      await Axios.post("/api/posts", body);
      setEnviendoPost(false);
      history.push("/");
    } catch (error) {
      mostrarError(error.response.data);
    }
  };

  return (
    <Main center>
      <div className="Ulpoad">
        <form onSubmit={handleSubmit}>
          <div className="Upload__image-section">
            <SeccionSubirImagen
              imagenUrl={imagenUrl}
              subiendoImagen={subiendoImagen}
              handleImageSelected={handleImageSelected}
            ></SeccionSubirImagen>
          </div>
          <textarea
            name="caption"
            className="Upload__caption"
            maxLength="180"
            placeholder="Caption de tu foto"
            required
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button className="Upload__submit" type="submit">
            Post
          </button>
        </form>
      </div>
    </Main>
  );
}

function SeccionSubirImagen({
  subiendoImagen,
  imagenUrl,
  handleImageSelected,
}) {
  if (subiendoImagen) {
    return <Loading />;
  } else if (imagenUrl) {
    return <img src={imagenUrl} alt="" />;
  } else {
    return (
      <label className="Upload__image-label">
        <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
        <span>Publica una foto</span>
        <input
          type="file"
          className="hidden"
          name="imagen"
          onChange={handleImageSelected}
        />
      </label>
    );
  }
}
