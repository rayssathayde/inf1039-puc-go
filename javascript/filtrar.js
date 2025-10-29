const barra = document.getElementById("barraPesquisa"); 
const filtro = document.querySelector(".filtro");
const btnLimpar = document.querySelector(".clean"); 
const checkboxes = document.querySelectorAll(".acessibilidade input[type='checkbox']"); 

barra.addEventListener("focus", () => {
  filtro.classList.add("show");
});

document.addEventListener("click", (e) => {
  if (!barra.contains(e.target) && !filtro.contains(e.target)) {
    filtro.classList.remove("show");
  }
});

btnLimpar.addEventListener("click", () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false; 
  });
});
