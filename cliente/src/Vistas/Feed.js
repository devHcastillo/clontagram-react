import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

import Main from "../Componentes/Main";
import Loading from "../Componentes/Loading";
import Post from "../Componentes/Post";

const cargarPosts = async (fechaUltimoPost) => {
  const query = fechaUltimoPost ? `?fecha=${fechaUltimoPost}` : "";
  const { data: nuevosPost } = await Axios.get(`api/posts/feed${query}`);
  return nuevosPost;
};

const NUMEROS_DE_POSTS_POR_LLAMADA = 3;

export default function Feed({ mostrarError, usuario }) {
  const [posts, setPosts] = useState([]);
  const [cargandoPostsIniciales, setCargandoPostsIniciales] = useState(true);
  const [cargandoMasPosts, setCargandoMasPosts] = useState(false);
  const [todosLosPostsCargados, setTodosLosPostsCargados] = useState(false);

  useEffect(() => {
    async function cargarPostsIniciales() {
      try {
        const nuevosPost = await cargarPosts();
        setPosts(nuevosPost);
        console.log(nuevosPost);
        setCargandoPostsIniciales(false);
        revisarSiHayMasPosts(nuevosPost);
      } catch (error) {
        mostrarError("Hubo un problema cargando tu feed");
        console.log(error);
      }
    }
    cargarPostsIniciales();
  }, []);

  function actualizarPost(postOriginal, postActualizado) {
    setPosts((posts) => {
      const postsActualizados = posts.map((post) => {
        if (post !== postOriginal) {
          return post;
        }

        return postActualizado;
      });
      return postsActualizados;
    });
  }

  async function cargarMasPosts() {
    if (cargandoMasPosts) {
      return;
    }

    try {
      setCargandoMasPosts(true);
      const fechaDelUltimoPost = posts[posts.length - 1].fecha_creado;
      const nuevosPosts = await cargarPosts(fechaDelUltimoPost);
      setPosts((viejosPosts) => [...viejosPosts, ...nuevosPosts]);
      setCargandoMasPosts(false);
      revisarSiHayMasPosts(nuevosPosts);
    } catch (error) {
      setCargandoMasPosts(false);
      mostrarError("Ocurrio un problema cargando los nuevos posts");
      console.log(error);
    }
  }

  function revisarSiHayMasPosts(nuevosPosts) {
    if (nuevosPosts.length < NUMEROS_DE_POSTS_POR_LLAMADA) {
      setTodosLosPostsCargados(true);
    }
  }

  if (cargandoPostsIniciales) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (!cargandoPostsIniciales && posts.length === 0) {
    return (
      <Main>
        <NoSiguesANadie />
      </Main>
    );
  }

  return (
    <Main center>
      <div className="Feed">
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            actualizarPost={actualizarPost}
            mostrarError={mostrarError}
            usuario={usuario}
          />
        ))}
        <CargarMasPost onClick={cargarMasPosts}  todosLosPostsCargados={todosLosPostsCargados}/>
      </div>
    </Main>
  );
}

const NoSiguesANadie = () => {
  return (
    <div className="NoSiguesANadie">
      <p className="NoSiguesANadie__mensaje">
        Tu feed no tiene fotos porque no sigues a nadie, o poque no han
        publicado fotos
      </p>
      <div className="text-center">
        <Link to="/explore" className="NoSiguesANadie__boton">
          Explora Clontagram
        </Link>
      </div>
    </div>
  );
};

function CargarMasPost({ onClick, todosLosPostsCargados }) {
  if (todosLosPostsCargados) {
    return <div className="Feed__no-hay-mas-posts">No hay mas posts</div>;
  }
  return (
    <button className="Feed__cargar-mas" onClick={onClick}>
      Ver mas
    </button>
  );
}
