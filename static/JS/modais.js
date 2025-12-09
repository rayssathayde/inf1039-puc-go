// Arquivo: static/JS/modais.js

(function() {
    'use strict';
    
    console.log("🔵 Script modais.js carregado!");
    
    // Espera a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarModais);
    } else {
        inicializarModais();
    }
    
    function inicializarModais() {
        console.log("🟢 Inicializando modais...");
        
        // Pega os elementos
        const modalContato = document.getElementById('modalContato');
        const modalAjuda = document.getElementById('modalAjuda');
        
        const linkAjuda = document.querySelector('[data-modal="ajuda"]');
        const linkContato = document.querySelector('[data-modal="contato"]');
        
        const btnFecharAjuda = document.getElementById('btnFecharAjuda');
        const btnFecharContato = document.getElementById('btnFecharContato');
        const formContato = document.getElementById('formContato');
        
        // Debug
        console.log("Modal Contato:", modalContato ? "✅" : "❌");
        console.log("Modal Ajuda:", modalAjuda ? "✅" : "❌");
        console.log("Link Ajuda:", linkAjuda ? "✅" : "❌");
        console.log("Link Contato:", linkContato ? "✅" : "❌");
        
        // Funções auxiliares
        function abrirModal(modal) {
            if (!modal) return;
            console.log("🔓 Abrindo modal:", modal.id);
            modal.style.display = 'flex';
            document.body.classList.add('modal-aberto');
        }
        
        function fecharModal(modal) {
            if (!modal) return;
            console.log("🔒 Fechando modal:", modal.id);
            modal.style.display = 'none';
            document.body.classList.remove('modal-aberto');
        }
        
        // LINK AJUDA
        if (linkAjuda && modalAjuda) {
            linkAjuda.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log("👆 Clicou em AJUDA");
                abrirModal(modalAjuda);
                return false;
            };
            console.log("✅ Link Ajuda configurado");
        }
        
        // LINK CONTATO
        if (linkContato && modalContato) {
            linkContato.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log("👆 Clicou em CONTATO");
                abrirModal(modalContato);
                return false;
            };
            console.log("✅ Link Contato configurado");
        }
        
        // BOTÃO FECHAR AJUDA
        if (btnFecharAjuda && modalAjuda) {
            btnFecharAjuda.onclick = function() {
                fecharModal(modalAjuda);
            };
        }
        
        // BOTÃO FECHAR CONTATO
        if (btnFecharContato && modalContato) {
            btnFecharContato.onclick = function() {
                fecharModal(modalContato);
            };
        }
        
        // FORMULÁRIO DE CONTATO
        if (formContato) {
            formContato.onsubmit = function(e) {
                e.preventDefault();
                const nome = document.getElementById('nomeContato').value;
                alert(`Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`);
                formContato.reset();
                fecharModal(modalContato);
                return false;
            };
        }
        
        // FECHAR CLICANDO FORA
        window.onclick = function(e) {
            if (e.target === modalContato) {
                fecharModal(modalContato);
            }
            if (e.target === modalAjuda) {
                fecharModal(modalAjuda);
            }
        };
        
        // FECHAR COM ESC
        document.onkeydown = function(e) {
            if (e.key === 'Escape') {
                if (modalContato && modalContato.style.display === 'flex') {
                    fecharModal(modalContato);
                }
                if (modalAjuda && modalAjuda.style.display === 'flex') {
                    fecharModal(modalAjuda);
                }
            }
        };
        
        console.log("🎉 Modais configurados com sucesso!");
    }
    
})();