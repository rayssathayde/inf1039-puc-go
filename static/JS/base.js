const menuBtn = document.querySelector('.menu-btn');
const sideMenu = document.getElementById('sideMenu');
const barra = document.getElementById("barraPesquisa"); 
const filtro = document.querySelector(".filtro");
const btnLimpar = document.querySelector(".clean"); 
const checkboxes = document.querySelectorAll(".acessibilidade input[type='checkbox']"); 
console.log("JS carregado!");

// MENU LATERAL
menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sideMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        sideMenu.classList.remove('active');
    }
});

// filtro
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

//Modais de ajuda e suporte
const modalAjuda = document.getElementById('modalAjuda');
const modalSuporte = document.getElementById('modalSuporte');

// Segundo modal
const modalInstrucoes = document.getElementById('modalInstrucoes');
const btnEntendi = document.getElementById('btnEntendi');

// Função para abrir um modal
function abrirModal(modalElement) {
    fecharTodosModais(); 
    modalElement.style.display = 'flex'; 
    document.body.classList.add('modal-aberto');
}

// Fechar modal específico
function fecharModal(modalElement) {
    modalElement.style.display = 'none'; 
}

// Fechar todos modais
function fecharTodosModais() {
    meuModal.style.display = 'none';
    modalInstrucoes.style.display = 'none';
    document.body.classList.remove('modal-aberto');
}

// Registra primeira visita
function usuarioJaViuTutorial() {
    return localStorage.getItem("tutorialVisto") === "true";
}

function marcarTutorialVisto() {
    localStorage.setItem("tutorialVisto", "true");
}

// MOSTRAR APENAS NA PRIMEIRA VEZ. O problema era que a função antiga sempre abria o modal.
// Agora só abre se Usuario nunca interagiu com o modal antes.
window.addEventListener('load', () => {
    if (!usuarioJaViuTutorial()) {
        abrirModal(meuModal);
    }
});

// --- BOTÕES ---
btnNaoVisitar.addEventListener('click', () => {
    marcarTutorialVisto();
    fecharTodosModais();
});

btnSimVisitar.addEventListener('click', () => {
    fecharModal(meuModal);
    abrirModal(modalInstrucoes);
});

btnEntendi.addEventListener('click', () => {
    marcarTutorialVisto();
    fecharTodosModais();
});




//-------------------------------- ---------------------------------//

// ============== TOGGLE SENHA (MOSTRAR/OCULTAR) ==============
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Encontra o input de senha relacionado ao botão
        const passwordInput = this.parentElement.querySelector('input');
        const eyeIcon = this.querySelector('.eye-icon');
        
        // Alterna entre password e text
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.setAttribute('data-lucide', 'eye-off');
        } else {
            passwordInput.type = 'password';
            eyeIcon.setAttribute('data-lucide', 'eye');
        }
        
        // Reinicializa os ícones do Lucide para refletir a mudança
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
});

















