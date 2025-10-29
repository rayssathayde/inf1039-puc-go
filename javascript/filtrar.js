const barra = document.getElementById("barraPesquisa");
const filtro = document.querySelector(".filtro");

// Quando clicar (focar) na barra, mostra o filtro
barra.addEventListener("focus", () => {
  filtro.classList.add("show");
});

// Quando clicar fora da barra e do filtro, esconde
document.addEventListener("click", (e) => {
  if (!barra.contains(e.target) && !filtro.contains(e.target)) {
    filtro.classList.remove("show");
  }
});