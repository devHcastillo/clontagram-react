import React, { useState } from "react";

export default function Comentar({ onSubmitComentario, mostrarError }) {
  const [mensaje, setMensaje] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (enviandoComentario) {
      return;
    }

    try {
      setEnviandoComentario(true);
      await onSubmitComentario(mensaje);
      setMensaje("");
    } catch (error) {
      setEnviandoComentario(false);
      mostrarError('Hubo un problema enviando el comentario')
      console.log(error);
    }
  };

  return (
    <form className="Post__comentario-form-container" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Deja un comentario"
        required
        maxLength="180"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />

      <button type="submit">Post</button>
    </form>
  );
}
