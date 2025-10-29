    const menuBtn = document.querySelector('.menu-btn');
    const sideMenu = document.getElementById('sideMenu');
    const barra = document.getElementById("barraPesquisa"); 
    const filtro = document.querySelector(".filtro");
    const btnLimpar = document.querySelector(".clean"); 
    const checkboxes = document.querySelectorAll(".acessibilidade input[type='checkbox']"); 
console.log("JS carregado!");

    
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sideMenu.classList.toggle('active');
    });

    
    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            sideMenu.classList.remove('active');
        }
    });

//filtro   

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

