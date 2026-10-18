"use strict";
const input = document.querySelector("#archivo"),
  estado = document.querySelector("#estado"),
  registros = document.querySelector("#registros");

function mostrarXml(contenido, origen) {
  const xml = new DOMParser().parseFromString(contenido, "application/xml");

  if (
    xml.querySelector("parsererror") ||
    xml.documentElement.nodeName !== "tramites"
  ) {
    throw Error("El archivo XML no tiene la estructura esperada.");
  }

  const items = [...xml.querySelectorAll("tramite")];

  if (items.length !== 3) {
    throw Error("Se esperaban exactamente tres trámites.");
  }

  registros.replaceChildren();
  items.forEach((n) => {
    const card = document.createElement("article");
    card.className = "tarjeta";

    const title = document.createElement("h2");
    title.textContent = n.querySelector("nombre")?.textContent || "Sin título";

    const desc = document.createElement("p");
    desc.textContent = n.querySelector("descripcion")?.textContent || "";

    const mode = document.createElement("p");
    mode.textContent =
      "Modalidad: " +
      (n.querySelector("modalidad")?.textContent || "No indicada");

    card.append(title, desc, mode);
    registros.append(card);
  });

  estado.textContent = `${origen}: ${items.length} trámites cargados.`;
}

async function cargarDatos() {
  try {
    const respuesta = await fetch("datos.xml");

    if (!respuesta.ok) {
      throw Error(`No se pudo cargar datos.xml (${respuesta.status}).`);
    }

    mostrarXml(await respuesta.text(), "datos.xml");
  } catch (error) {
    registros.replaceChildren();
    estado.textContent =
      "No fue posible cargar datos.xml automáticamente. Selecciona el archivo XML para consultarlo.";
    console.error(error);
  }
}

input.addEventListener("change", async () => {
  const file = input.files[0];
  if (!file) {
    return;
  }

  try {
    mostrarXml(await file.text(), file.name);
  } catch (error) {
    estado.textContent = error.message;
    registros.replaceChildren();
  }
});

cargarDatos();
