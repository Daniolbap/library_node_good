import express from "express";
import booksRouter from "./routes/books.js";
import db from "./db.js";

const app = express();
app.set("view engine", "ejs");
const port = 3000;
app.use(express.urlencoded({ extended: true })); //Cuando llegue información de un formulario, quiero que puedas interpretarla."
app.use(express.json()); //cuando llegue json lo interpretamsos
app.use(express.static("public"));
app.use(booksRouter); //

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books");
    res.render("index.ejs", {
      books: result.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error del servidor");
  }

  //console.log(result.rows);
});

//GET
//→ quiero obtener/consultar algo

//POST
//→ quiero enviar datos al servidor para que haga algo

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
