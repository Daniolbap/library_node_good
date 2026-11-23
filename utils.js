// export “Esta función puede ser utilizada desde otros archivos”.

export function comprobarLibroAutor(libro) {
  if (libro.title === "" || libro.author === "" || libro.genre === "") {
    return false;
  }
  return true;
}

export function prepararLibro(title, author, genre) {
  title = title.trim();
  author = author.trim();
  genre = genre.trim();

  title = title.charAt(0).toUpperCase() + title.slice(1);
  author = author.charAt(0).toUpperCase() + author.slice(1);
  genre = genre.charAt(0).toUpperCase() + genre.slice(1);
  return {
    title: title,
    author: author,
    genre: genre,
  };
}

export function prepararnombre(nombre) {
  nombre = nombre.trim();

  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

