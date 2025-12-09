document.addEventListener("DOMContentLoaded", async function () {
  const lat = -22.979279047516552;
  const lon = -43.23199899901637;
  const map = L.map("map").setView([lat, lon], 17);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Marcador do usuário
  let userMarker = null;

  // Linha da rota
  let rotaLayer = null;

  // Ícone dos prédios
  const iconePredio = L.divIcon({
    html:
      '<i class="fa fa-location-dot" style="color: #030052; font-size: 32px;"></i>',
    className: "custom-div-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  // Ícone do usuário
  const iconeUsuario = L.divIcon({
    html:
      '<i class="fa-solid fa-circle" style="color: #2563eb; font-size: 18px;"></i>',
    className: "usuario-marker",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  // CSRF HELPER. Necessário para poder fazer alterações no banco pelo Django. Questao de segurança, ate onde entendi
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  //LOCALIZAÇÃO DO USUÁRIO
  function localizarUsuario() {
    if (!navigator.geolocation) {
      console.warn("Geolocalização não suportada pelo navegador.");
      alert("Seu navegador não suporta geolocalização.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (!userMarker) {
          userMarker = L.marker([lat, lng], { icon: iconeUsuario })
            .addTo(map)
            .bindPopup("Você está aqui");
        } else {
          userMarker.setLatLng([lat, lng]);
        }

        // Polígono da área da PUC
        const polygon_puc = L.polygon([
          [-22.979999, -43.231609],
          [-22.978704, -43.230997],
          [-22.977361, -43.23126],
          [-22.977455, -43.232336],
          [-22.979003, -43.234457],
          [-22.979902, -43.234543],
          [-22.981314, -43.236056],
          [-22.982218, -43.235219],
          [-22.981109, -43.233489],
        ]).addTo(map);

        // Centraliza no usuário quando encontra a localização
        map.setView([lat, lng], 17);
      },
      (err) => {
        console.warn("Erro ao obter localização do usuário:", err);
        alert("Não foi possível obter sua localização. Verifique as permissões.");
      }
    );
  }




  //BOTÃO PARA CENTRALIZAR NO USUÁRIO                         rafa
  function centralizarNoUsuario() {
    if (!userMarker) {
      alert("Sua localização ainda não foi carregada!");
      return;
    }

    const userPos = userMarker.getLatLng();
    map.setView([userPos.lat, userPos.lng], 18, {
      animate: true,
      duration: 0.5
    });
  }
  //rafa

  // FUNÇÃO PARA TRAÇAR ROTA ATÉ A ENTRADA DA PUC
  function tracarRotaEntradaPUC() {
    const entradaPUCLat = -22.979279047516552;
    const entradaPUCLng = -43.23199899901637;
    
    irPara(entradaPUCLat, entradaPUCLng);
  }





  //FUNÇÃO DE ROTA (OSRM)
  window.irPara = async function (destLat, destLng) {
    if (!userMarker) {
      alert("Sua localização ainda não foi carregada!");
      return;
    }

    const origem = userMarker.getLatLng();
    const destino = { lat: destLat, lng: destLng };

    const url = `https://router.project-osrm.org/route/v1/foot/${origem.lng},${origem.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error("Erro na resposta do serviço de rotas.");
      }

      const data = await resp.json();

      if (!data.routes || data.routes.length === 0) {
        alert("Nenhuma rota encontrada.");
        return;
      }

      // OSRM devolve [lng, lat] → Leaflet usa [lat, lng]
      const coords = data.routes[0].geometry.coordinates;
      const latlngs = coords.map((c) => [c[1], c[0]]);

      if (rotaLayer) {
        map.removeLayer(rotaLayer);
      }

      // Linha da rota em vermelho
      rotaLayer = L.polyline(latlngs, { color: "red", weight: 5 }).addTo(map);

      // Distância em metros
      const distanciaMetros = data.routes[0].distance;

      // Velocidade média a pé: 4 km/h
      const velocidadeKmH = 4;
      const tempoMinutos = Math.round(
        (distanciaMetros / 1000 / velocidadeKmH) * 60
      );

      // Atualiza o card de navegação (se existir)
      mostrarNavegacao(distanciaMetros, tempoMinutos);

      map.fitBounds(rotaLayer.getBounds(), { padding: [40, 40] });
    } catch (err) {
      console.error("Erro ao calcular rota:", err);
      alert("Não foi possível calcular a rota. Tente novamente mais tarde.");
    }
  };

  // ROTA + REGISTRO NO BACKEND
  window.handleTracarRota = async function (nomePredio, destLat, destLng) {
    console.log("handleTracarRota chamado:", nomePredio, destLat, destLng);

    // Desenha a rota
    await irPara(destLat, destLng);

    // Registra no histórico (se usuário estiver logado)
    try {
      const resp = await fetch("/rotas/registros/registrar-rota/", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          nome: nomePredio,
          latitude: destLat,
          longitude: destLng,
        }),
      });

      const text = await resp.text();
      console.log(
        "Resposta de /rotas/registros/registrar-rota/:",
        resp.status,
        text
      );

      if (!resp.ok) {
        console.warn("Não foi possível registrar a rota. Código " + resp.status);
      }
    } catch (e) {
      console.error("Erro de rede ao registrar rota:", e);
    }
  };

  // CARD DE NAVEGAÇÃO (DISTÂNCIA/TEMPO)
  function mostrarNavegacao(distancia, tempo) {
    const navCard = document.querySelector(".nav-ativa");
    if (!navCard) return;

    // Tempo em texto
    let tempoTexto = "";
    if (tempo < 60) {
      tempoTexto = `${tempo} minutos`;
    } else {
      const horas = Math.floor(tempo / 60);
      const minutos = tempo % 60;

      if (minutos === 0) {
        tempoTexto = `${horas} h`;
      } else {
        tempoTexto = `${horas} h e ${minutos} min`;
      }
    }

    // Distância em texto
    const distanciaTexto =
      distancia < 1000
        ? `${Math.round(distancia)} metros`
        : `${(distancia / 1000).toFixed(2)} km`;

    // Preenche os <p> dentro de .dados-rota
    const dados = navCard.querySelector(".dados-rota");
    if (dados) {
      const pTempo = dados.querySelector("p:nth-child(2)");
      const pDist = dados.querySelector("p:nth-child(4)");

      if (pTempo) pTempo.textContent = tempoTexto;
      if (pDist) pDist.textContent = distanciaTexto;
    }

    navCard.style.display = "block";
  }

  // Botão de fechar o card de navegação
  const btnFecha = document.querySelector(".nav-ativa .btn-texto");
  if (btnFecha) {
    btnFecha.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      document.querySelector(".nav-ativa").style.display = "none";
      if (rotaLayer) {
        map.removeLayer(rotaLayer); // remove a rota do mapa
      }
    });
  }

  //CARREGAR PRÉDIOS DA API
  async function carregarPredios() {
    try {
      const resp = await fetch("/api/predios/", {
        credentials: "same-origin",
      });

      if (!resp.ok) {
        throw new Error("Não foi possível carregar /api/predios/");
      }

      const dados = await resp.json();
      console.log("JSON de /api/predios/:", dados);

      dados.forEach((p) => {
        const { nome, descricao, coordenadas } = p;

        if (!Array.isArray(coordenadas) || coordenadas.length < 2) {
          console.warn("Coordenadas inválidas para o prédio:", p);
          return;
        }

        const [lat, lng] = coordenadas;

        const marker = L.marker([lat, lng], { icon: iconePredio }).addTo(map);

        // Escapa aspas simples no nome para não quebrar o onclick
        const safeNome = nome.replace(/'/g, "\\'");

        marker.bindPopup(`
          <div>
            <strong>${nome}</strong><br/>
            ${
              descricao
                ? `<span style="font-size:0.85rem;">${descricao}</span><br/>`
                : ""
            }
            <button 
              class="btn-traçar-rota" 
              onclick="handleTracarRota('${safeNome}', ${lat}, ${lng})"
              style="
                margin-top: 6px;
                padding: 6px 10px;
                border-radius: 6px;
                border: none;
                background-color: #111827;
                color: #fff;
                cursor: pointer;
                font-size: 0.85rem;
              "
            >
              Traçar rota até aqui
            </button>
          </div>
        `);
      });
    } catch (err) {
      console.error("Erro ao carregar prédios da API:", err);
    }
  }

  // INICIALIZAÇÃO
  localizarUsuario();
  await carregarPredios();

  // Se vier com /mapa?lat=...&lng=..., traça a rota direto (sem registrar). Para podermos fazer testes, sem poluir o historico de registros
  const urlParam = new URLSearchParams(window.location.search);
  const destLat = urlParam.get("lat");
  const destLng = urlParam.get("lng");

  if (destLat && destLng) {
    setTimeout(() => {
      irPara(parseFloat(destLat), parseFloat(destLng));
    }, 100);
  }

  // BOTÃO DE CENTRALIZAR LOCALIZAÇÃO
  const btnMinhaLoc = document.getElementById("btnMinhaLocalizacao");
  if (btnMinhaLoc) {
    btnMinhaLoc.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      centralizarNoUsuario();
    });
  } else {
    console.warn("Botão de localização não encontrado!");
  }

  // BOTÃO DE TRAÇAR ROTA ATÉ A ENTRADA DA PUC
  const btnRotaEntrada = document.getElementById("btnRotaEntrada");
  if (btnRotaEntrada) {
    btnRotaEntrada.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      tracarRotaEntradaPUC();
    });
  } else {
    console.warn("Botão de rota para entrada não encontrado!");
  }
});


