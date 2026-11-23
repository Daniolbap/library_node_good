import test from "node:test";
import assert from "node:assert/strict";

export function prepararnombre(nombre) {
  nombre = nombre.trim();

  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}
test("debe no dar espacios y la primera mayuscula", () => {
  const nombre = "  popo  ";

  const resultado = prepararnombre(nombre);

  assert.strictEqual(resultado, "Popo");
}); // node --test utils.js
test("GET personas debe responder 200", async () => {
  const responsePersonas = await fetch("http://localhost:3000/prueba/personas");

  const dataPersonas = await responsePersonas.json();

  assert.strictEqual(responsePersonas.status, 200);
});
test("debe devolver un array", async () => {
  const responsePersonas = await fetch("http://localhost:3000/prueba/personas");

  const dataPersonas = await responsePersonas.json();

  assert.strictEqual(Array.isArray(dataPersonas.personas), true);
});

test("express rechace datos invalidos con http 400", async () => {
  const datos = {
    nombre: " ",
    edad: 25,
  };
  const responsePersonas = await fetch("http://localhost:3000/prueba", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // le dice al servidor "Los datos que estoy enviando están en formato JSON."
    },
    body: JSON.stringify(datos),
  });

  const dataPersonas = await responsePersonas.json();

  assert.strictEqual(responsePersonas.status, 400);
});

test("express responde con nombre no valido", async () => {
  const datos = {
    nombre: " ",
    edad: 25,
  };
  const responsePersonas = await fetch("http://localhost:3000/prueba", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // le dice al servidor "Los datos que estoy enviando están en formato JSON."
    },
    body: JSON.stringify(datos),
  });

  const dataPersonas = await responsePersonas.json();

  assert.strictEqual(dataPersonas.error, "nombre no valido");
});

test("express responde con 400 con edad 0", async () => {
  const datos = {
    nombre: "daniel",
    edad: 0,
  };
  const responsePersonas = await fetch("http://localhost:3000/prueba", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // le dice al servidor "Los datos que estoy enviando están en formato JSON."
    },
    body: JSON.stringify(datos),
  });

  const dataPersonas = await responsePersonas.json();

  assert.strictEqual(responsePersonas.status, 400);
  assert.strictEqual(dataPersonas.error, "Edad no válida");
});

test("ejemplo de limpieza", async (t) => {
  assert.strictEqual(2 + 2, 4);
});

test("express responde con 201", async (t) => {
  const datos = {
    nombre: "daniel",
    edad: 25,
  };

  let id_Persona = null;
  t.after(async () => {
    //indica que se debe hacer cuando la prueba termine
    if (id_Persona === null) {
      return;
    }
    const deletePrueba = await fetch(
      `http://localhost:3000/prueba/personas/${id_Persona}`,
      {
        method: "DELETE",
      },
    );
    console.log(`termino la prueba y se elimino el id : ${id_Persona}`);
    console.log(id_Persona);
    assert.strictEqual(deletePrueba.status, 200);
  });

  const responsePersonas = await fetch("http://localhost:3000/prueba", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // le dice al servidor "Los datos que estoy enviando están en formato JSON."
    },
    body: JSON.stringify(datos),
  });

  const dataPersonas = await responsePersonas.json();

  id_Persona = dataPersonas.persona.id;

  const datos2 = {
    nombre: "david",
    edad: 22,
  };
  const changePersonas = await fetch(
    `http://localhost:3000/prueba/personas/${id_Persona}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // le dice al servidor "Los datos que estoy enviando están en formato JSON."
      },
      body: JSON.stringify(datos2),
    },
  );

  const cPersonas = await changePersonas.json();

  const showPersonas = await fetch("http://localhost:3000/prueba/personas");

  const sPersonas = await showPersonas.json();

   const perosna =  sPersonas.personas.find( personita => personita.id === id_Persona );

   console.log(perosna);

  assert.strictEqual(responsePersonas.status, 201);
  assert.strictEqual(changePersonas.status, 200);

  assert.strictEqual(perosna?.nombre, "David");
  assert.strictEqual(perosna?.edad, 22);
});
