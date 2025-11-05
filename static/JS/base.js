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


// ============== MODAIS ==============
const meuModal = document.getElementById('meuModal');
const btnNaoVisitar = document.getElementById('btnNaoVisitar');
const btnSimVisitar = document.getElementById('btnSimVisitar');

// Segundo modal getElement...
const modalInstrucoes = document.getElementById('modalInstrucoes');
const btnEntendi = document.getElementById('btnEntendi');




// Função para abrir um modal específico(?)
function abrirModal(modalElement) {
    
    fecharTodosModais(); 
    
    modalElement.style.display = 'flex'; 
    document.body.classList.add('modal-aberto');
}

 
function fecharModal(modalElement) {
    modalElement.style.display = 'none'; 
}

//Movimento da pagina
function fecharTodosModais() {
    meuModal.style.display = 'none';
    modalInstrucoes.style.display = 'none';
    document.body.classList.remove('modal-aberto'); 

}

//Mostra quando abre a pág
window.addEventListener('load', () => {
    abrirModal(meuModal);
});


// Primeiro modal:



btnNaoVisitar.addEventListener('click', fecharTodosModais);


btnSimVisitar.addEventListener('click', () => {
    fecharModal(meuModal);
    abrirModal(modalInstrucoes); 
});




//Segundo modal
btnEntendi.addEventListener('click', fecharTodosModais);