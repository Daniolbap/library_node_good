SELECT loans.book_id, books.title, users.name
FROM loans
 JOIN books ON loans.book_id = books.id
 JOIN users ON loans.user_id = users.id;

 SELECT loans.id ,books.title, users.name
FROM loans
 JOIN books ON loans.book_id = books.id
 JOIN users ON loans.user_id = users.id
 WHERE users.id = 1;

 SELECT loans.id ,books.title, users.name
FROM loans
 JOIN books ON loans.book_id = books.id
 JOIN users ON loans.user_id = users.id
 WHERE  users.id = 2
 ORDER BY  loans DESC;

 SELECT loans.id ,books.title, users.name,books.genre
FROM loans
 JOIN books ON loans.book_id = books.id
 JOIN users ON loans.user_id = users.id
 WHERE books.genre ILIKE '%clasic%';

 SELECT COUNT(*)
FROM loans
 JOIN books ON loans.book_id = books.id
 JOIN users ON loans.user_id = users.id
   WHERE  users.id = 2;

   SELECT users.name, COUNT(*) AS lend_books
FROM loans
 JOIN books ON loans.book_id = books.id
 JOIN users ON loans.user_id = users.id
 GROUP BY users.name;
 name | lend_books
-----|-----------
Ana  | 3
Pablo| 2
-----------------------------------------------
SELECT users.name, COUNT(*) AS lend_books
FROM loans
 JOIN books ON loans.book_id = books.id
 JOIN users ON loans.user_id = users.id
 GROUP BY users.name
 HAVING COUNT(users.name) >5;
--------------------------------------------
Por eso usamos LEFT JOIN: conserva todos los registros de la tabla de la izquierda (users), aunque no tengan coincidencia.
SELECT users.name
FROM users
 left JOIN loans ON users.id = loans.user_id;

  SELECT users.name, COUNT(loans.book_id) AS lend_books
FROM users
 LEFT JOIN loans ON users.id  = loans.user_id
 GROUP BY users.name;

  SELECT users.name, COUNT(loans.book_id) AS lend_books
FROM users
 LEFT JOIN loans ON users.id  = loans.user_id
 GROUP BY users.name
 order by lend_books desc;

  SELECT users.name , books.title, COUNT(loans.book_id) AS lend_books
FROM users
 LEFT JOIN loans ON users.id  = loans.user_id
 LEFT JOIN books ON books.id  = loans.book_id
 GROUP BY users.name, books.title;
 
  SELECT users.name , books.title
FROM users
 LEFT JOIN loans ON users.id  = loans.user_id
 LEFT JOIN books ON books.id  = loans.book_id
  WHERE users.id = 1
 GROUP BY users.name, books.title;

//para prueba/ 
CREATE TABLE personas_prueba (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre TEXT NOT NULL CHECK (BTRIM(nombre) <> ''),
    edad INTEGER NOT NULL CHECK (edad > 0)
);