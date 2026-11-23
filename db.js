import pg from "pg"; //para utilizar  postgress

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: process.env.DB_NAME ?? "database",
  password: "hola",
  port: 5432,
});
db.connect((err) => {
  if (err) {
    console.error("Error conectando:", err);
  } else {
    db.query("SELECT current_database()", (err, resultado) => {
    if (err) {
        console.error("Error en la consulta:", err);
    } else {
        console.log("Base conectada:", resultado.rows[0].current_database);
        console.log("DB_NAME recibida por Node:", process.env.DB_NAME);
    }
});
  }
});
export default db; //"Quiero permitir que otro archivo pueda utilizar esto."
