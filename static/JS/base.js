const menuBtn = document.querySelector('.menu-btn');
const sideMenu = document.getElementById('sideMenu');
const barra = document.getElementById("barraPesquisa"); 
const filtro = document.querySelector(".filtro");
const btnLimpar = document.querySelector(".clean"); 
const checkboxes = document.querySelectorAll(".acessibilidade input[type='checkbox']"); 
console.log("JS carregado!");

//MENU LATERAL
if (menuBtn && sideMenu) {
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sideMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            sideMenu.classList.remove('active');
        }
    });
}

//FILTRO DE BUSCA
if (barra && filtro) {
    barra.addEventListener("focus", () => {
        filtro.classList.add("show");
    });

    document.addEventListener("click", (e) => {
        if (!barra.contains(e.target) && !filtro.contains(e.target)) {
            filtro.classList.remove("show");
        }
    });
}

if (btnLimpar && checkboxes) {
    btnLimpar.addEventListener("click", () => {
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false; 
        });
    });
}

//MODAIS
const meuModal = document.getElementById('meuModal');
const btnNaoVisitar = document.getElementById('btnNaoVisitar');
const btnSimVisitar = document.getElementById('btnSimVisitar');

const modalInstrucoes = document.getElementById('modalInstrucoes');
const btnEntendi = document.getElementById('btnEntendi');

const checkboxTermos = document.getElementById('aceitoTermos');

// Função para abrir um modal
function abrirModal(modalElement) {
    if (!modalElement) return;
    fecharTodosModais(); 
    modalElement.style.display = 'flex'; 
    document.body.classList.add('modal-aberto');
}

// Fechar modal específico
function fecharModal(modalElement) {
    if (!modalElement) return;
    modalElement.style.display = 'none'; 
}

// Fechar todos modais
function fecharTodosModais() {
    if (meuModal) meuModal.style.display = 'none';
    if (modalInstrucoes) modalInstrucoes.style.display = 'none';
    document.body.classList.remove('modal-aberto');
}

// Registra primeira visita
function usuarioJaViuTutorial() {
    return localStorage.getItem("tutorialVisto") === "true";
}

function marcarTutorialVisto() {
    localStorage.setItem("tutorialVisto", "true");
}

// Desabilita os botões até o usuário aceitar os termos
function atualizarEstadoBotoesTermos() {
    if (!checkboxTermos || !btnSimVisitar || !btnNaoVisitar) return;
    const habilitar = checkboxTermos.checked;
    btnSimVisitar.disabled = !habilitar;
    btnNaoVisitar.disabled = !habilitar;
}

// Configuração inicial dos termos (se existir checkbox)
if (checkboxTermos && btnSimVisitar && btnNaoVisitar) {
    btnSimVisitar.disabled = true;
    btnNaoVisitar.disabled = true;
    checkboxTermos.addEventListener('change', atualizarEstadoBotoesTermos);
}

// MOSTRAR APENAS NA PRIMEIRA VEZ
window.addEventListener('load', () => {
    if (!usuarioJaViuTutorial() && meuModal) {
        abrirModal(meuModal);
    }
});

// --- BOTÕES (só se existirem) ---
if (btnNaoVisitar) {
    btnNaoVisitar.addEventListener('click', () => {
        marcarTutorialVisto();
        fecharTodosModais();
    });
}

if (btnSimVisitar) {
    btnSimVisitar.addEventListener('click', () => {
        fecharModal(meuModal);
        abrirModal(modalInstrucoes);
    });
}

if (btnEntendi) {
    btnEntendi.addEventListener('click', () => {
        marcarTutorialVisto();
        fecharTodosModais();
    });
}
