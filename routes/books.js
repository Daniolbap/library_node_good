import express from "express";
import db from "../db.js"; // ../ subir una carpeta
import { prepararLibro, comprobarLibroAutor ,prepararnombre} from "../utils.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const libro = prepararLibro(req.body.title, req.body.author, req.body.genre);

  if (!comprobarLibroAutor(libro)) {
    return res.send("debes llenar los campos");
  }

  try {
    await db.query(
      "INSERT INTO books (title, author, genre) VALUES ($1, $2, $3)",
      [libro.title, libro.author, libro.genre],
    );
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).send("Ese libro ya existe");
    }

    console.error(error);
    return res.status(500).send("Error del servidor");
  }

  res.redirect("/"); //Post/Redirect/Get (PRG).
  //console.log(req.body);
});

router.post("/delete", async (req, res) => {
  const id = req.body.id;
  try {
    const result = await db.query("DELETE FROM books WHERE id = $1", [id]);
    console.log(result.rowCount);
    if (result.rowCount === 0) {
      return res.send("No existe el libro");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error del servidor");
  }
  res.redirect("/");
});

router.get("/edit", async (req, res) => {
  const id = req.query.id; //query porque estoy necesitando el dato de sql

  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    const book = result.rows[0];
    if (!book) {
      return res.send("no existe el libro ");
    }
    res.render("edit.ejs", { book: book });
    console.log(result.rowCount);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error del servidor");
  }

  console.log(id);
});

router.post("/edit", async (req, res) => {
  const id = req.body.id;
  const libro = prepararLibro(req.body.title, req.body.author, req.body.genre);

  if (!comprobarLibroAutor(libro)) {
    return res.send("debes llenar los campos");
  }

  try {
    const result = await db.query(
      "UPDATE books SET title = $1, author = $2, genre = $3 WHERE id = $4",
      [libro.title, libro.author, libro.genre, id],
    );
    if (result.rowCount === 0) {
      return res.send("No existe el libro");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error del servidor");
  }
  res.redirect("/");
  console.log(id, libro.title, libro.author, libro.author);
});

router.get("/search", async (req, res) => {
  res.render("search.ejs", {
    books: [],
    searched: false,
  });
});

router.post("/search2", async (req, res) => {
  const title = req.body.title.trim();

  if (title === "") {
    return res.send("Debes llenar todos los campos");
  }

  try {
    const result = await db.query("SELECT * FROM books WHERE title ILIKE $1", [
      `%${title}%`,
    ]);

    console.log(result.rows);

    res.render("search.ejs", {
      books: result.rows,
      searched: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error del servidor");
  }
});

router.get("/prueba", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books");

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error del servidor",
    });
  }
});

router.get("/prueba/personas", async (req, res) => {
  try {
    const show = await db.query("SELECT * FROM  personas_prueba");

    res.json({
      personas: show.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error del servidor",
    });
  }
});

router.delete("/prueba/personas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (id <= 0 || Number.isInteger(id) !== true) {
      console.log("id no valida");
      return res.status(400).json({
        error: "id no válida",
      });
    }
    const result = await db.query(
      "DELETE FROM personas_prueba WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "No se encontro lo persona",
      });
    }

    console.log(result.rowCount);
    console.log(req.params.id);

    return res.status(200).json({
      mensaje: "Persona eliminada correctamente",
      persona: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error del servidor",
    });
  }
});

router.patch("/prueba/personas/:id", async (req, res) => {
  try {
    const { nombre, edad } = req.body;
    
    const id = Number(req.params.id);
    if (id <= 0 || Number.isInteger(id) !== true) {
      console.log("id no valida");
      return res.status(400).json({
        error: "id no válida",
      });
    }
    console.log("id valida");

    if (edad <= 0 || Number.isInteger(edad) !== true) {
      console.log("edad no valida");
      return res.status(400).json({
        error: "Edad no válida",
      });
    }
    console.log("edad valida");

    if (typeof nombre !== "string" || nombre.trim() == "") {
      console.log("nombre invalido");
      return res.status(400).json({
        error: "nombre no valido",
      });
    }
  const nNmae=  prepararnombre(nombre);
    const result = await db.query(
      "UPDATE  personas_prueba  SET nombre = $1, edad = $2 WHERE id = $3 RETURNING *",
      [nNmae, edad, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "No se encontro lo persona",
      });
    }

    return res.status(200).json({
      mensaje: "Persona actualizada correctamente",
      persona: result.rows[0],
    });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error del servidor",
    });
  }
});
router.post("/prueba", async (req, res) => {
  console.log("llegó el POST");
  console.log(req.body);
  const { nombre, edad } = req.body; //hace que  req.body.nombre = nombre y req.body.edad = edad

  if (edad <= 0 || typeof edad !== "number") {
    console.log("edad no valida");
    return res.status(400).json({
      error: "Edad no válida",
    });
  }
  console.log("edad valida");

  if (typeof nombre !== "string" || nombre.trim() == "") {
    console.log("nombre invalido");
    return res.status(400).json({
      error: "nombre no valido",
    });
  }
   const nNmae=  prepararnombre(nombre);
  console.log("nombre valido");

  try {
    const result = await db.query(
      "INSERT INTO personas_prueba (nombre, edad) VALUES ($1, $2) RETURNING *",
      [nNmae, edad],
    );

    //console.log(result.rows[0]);
    //console.log(show.rows);

    return res.status(201).json({
      mensaje: "Persona creada correctamente",
      persona: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error conectando a la base de datos",
    });
  }
});
export default router;
