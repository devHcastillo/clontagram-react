import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

import Main from "../Componentes/Main";
import Loading from "../Componentes/Loading";
import Avatar from "../Componentes/Avatar";
import Comentar from "../Componentes/Comentar";
import BotonLIke from "../Componentes/BotonLike";
import RecursoNoExiste from "../Componentes/RecursoNoExiste";

import { toggleLike, ComentarHelper } from "../Helpers/post-helpers";

export default function PostVista({ mostrarError, match, usuario }) {
  const postId = match.params.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postNoExiste, setPostNoExiste] = useState(false);
  const [enviandoLike, setEnviandoLike] = useState(false);

  useEffect(() => {
    async function cargarPost() {
      try {
        const { data: post } = await Axios.get(`/api/posts/${postId}`);
        setPost(post);
        setLoading(false);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          setPostNoExiste(true);
        } else {
          mostrarError("Hubo un error, intentalo mas tarde");
        }
        setLoading(false);
      }
    }
    cargarPost();
  }, [postId]);

  async function onSubmitComentario(mensaje) {
    const postActualizado = await ComentarHelper(post, mensaje, usuario);

    setPost(postActualizado);
  }

  async function onSubmitLike() {
    if (enviandoLike) {
      return;
    }
    try {
      setEnviandoLike(true);
      const postActualizado = await toggleLike(post);
      setPost(postActualizado);
      setEnviandoLike(false);
    } catch (error) {
      setEnviandoLike(false);

      mostrarError("Hubo un error al tratar de dar like");
      console.log(error);
    }
  }

  if (loading) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (postNoExiste) {
    return (
      <RecursoNoExiste mensaje="El post que estas intentando ver no existe"></RecursoNoExiste>
    );
  }

  if (post == null) {
    return null;
  }
  return (
    <Main center>
      <Post
        {...post}
        onSubmitComentario={onSubmitComentario}
        onSubmitLike={onSubmitLike}
      ></Post>
    </Main>
  );
}

function Post({
  comentarios,
  caption,
  url,
  usuario,
  estaLike,
  onSubmitLike,
  onSubmitComentario,
}) {
  return (
    <div className="Post">
      <div className="Post__image-container">
        <img src={url} alt={caption} />
      </div>
      <div className="Post__side-bar">
        <Avatar usuario={usuario}></Avatar>

        <div className="Post__comentarios-y-like">
          <Comentarios
            usuario={usuario}
            caption={caption}
            comentarios={comentarios}
          ></Comentarios>

          <div className="Post__like">
            <BotonLIke onSutmitLike={onSubmitLike} like={estaLike}></BotonLIke>
          </div>
          <Comentar onSubmitComentario={onSubmitComentario}></Comentar>
        </div>
      </div>
    </div>
  );
}

function Comentarios({ usuario, caption, comentarios }) {
  return (
    <ul className="Post__comentarios">
      <li className="Post__comentario">
        <Link
          to={`/perfil/${usuario.username}`}
          className="Post__autor-comentario"
        >
          <b> {usuario.username}</b>
        </Link>{" "}
        {caption}
      </li>
      {comentarios.map((comentario) => {
        return (
          <li key={comentario._id} className="Post__comentario">
            <Link
              to={`/perfil/${comentario.usuario.username}`}
              className="Post__autor-comentario"
            >
              <b> {comentario.usuario.username}</b> {comentario.mensaje}
            </Link>{" "}
          </li>
        );
      })}
    </ul>
  );
}
