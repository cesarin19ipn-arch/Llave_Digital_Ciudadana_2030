"use strict";
const buscar = document.querySelector("#buscar"),
  modalidad = document.querySelector("#modalidad"),
  tarjetas = [...document.querySelectorAll(".tramite")],
  contador = document.querySelector("#contador"),
  sinResultados = document.querySelector("#sinResultados");

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function filtrar() {
  const texto = normalizar(buscar.value.trim());
  let n = 0;

  for (const tarjeta of tarjetas) {
    const nombre = tarjeta.querySelector("h3")?.textContent || "";
    const descripcion = tarjeta.querySelector("h3 + p")?.textContent || "";
    const contenidoBuscable = normalizar(`${nombre} ${descripcion}`);
    const mostrar =
      contenidoBuscable.includes(texto) &&
      (modalidad.value === "todos" ||
        tarjeta.dataset.modalidad === modalidad.value);

    tarjeta.hidden = !mostrar;
    if (mostrar) n++;
  }

  contador.textContent = `${n} ${n === 1 ? "trámite disponible" : "trámites disponibles"}`;
  sinResultados.classList.toggle("oculto", n !== 0);
}

buscar.addEventListener("input", filtrar);
modalidad.addEventListener("change", filtrar);
document.querySelector("#limpiar").addEventListener("click", () => {
  buscar.value = "";
  modalidad.value = "todos";
  filtrar();
  buscar.focus();
});
