document.addEventListener("DOMContentLoaded",  async function () {
  
  // Puc-Rio coordenadas
  const lat = -22.979279047516552; 
  const lon =  -43.23199899901637;
  const map = L.map("map").setView([lat, lon], 17);

  
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:19,
    attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  
  //Marcador do usuário
  let userMarker = null;

  //linha da rota
  let rotaLayer =null;

  //icone dos predios

  const iconePredio = L.divIcon({
    html: '<i class="fa fa-location-dot" style="color: #030052; font-size: 32px;"></i>',
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  const iconeUsuario = L.divIcon({
    html: '<i class="fa-solid fa-circle" style="color: #2563eb; font-size: 18px;"></i>',
    className: "usuario-marker",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});
  
  //localizacao do usuario
  function localizarUsuario() {
      if (!navigator.geolocation) {
          console.warn("Geolocalização não suportada pelo navegador.");
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

              //area puc
              var polygon_puc= L.polygon([
                [-22.979999, -43.231609],
                [-22.978704, -43.230997],
                [-22.977361, -43.231260],
                [-22.977455, -43.232336],
                [-22.979003, -43.234457],
                [-22.979902, -43.234543],
                [-22.981314, -43.236056],
                [-22.982218, -43.235219],
                [-22.981109, -43.233489],
              ]).addTo(map);

              // opcional: centralizar no usuário
              //map.setView([lat, lng], 17);
          },
          (err) => {
              console.warn("Erro ao obter localização do usuário:", err);
          }
      );
  }

  
  //funçao de rota


  window.irPara = async function (destLat, destLng) {
    if (!userMarker) {
      alert("Sua localização ainda não foi carregada!");
      return;
    }
    
    const origem = userMarker.getLatLng();
    const destino = { lat: destLat, lng: destLng };

    const url = `https://router.project-osrm.org/route/v1/foot/${origem.lng},${origem.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;

    try{
      const resp = await fetch(url);
      if(!resp.ok){
        throw new Error("Erro na resposta do serviço de rotas.");
      }

      const data = await resp.json();
    
      if (!data.routes || data.routes.length === 0) {
            alert("Nenhuma rota encontrada.");
            return;
      }

      const coords = data.routes[0].geometry.coordinates; // pega do osrm como lng,lat
      const latlngs = coords.map((c) => [c[1], c[0]]); //inverte, pois leaflet usa lat,lng

    if (rotaLayer) {
      map.removeLayer(rotaLayer);
    }

    rotaLayer = L.polyline(latlngs, { color:'red', weight: 5 }).addTo(map);

    // calculo da distancia em metros e do tempo em segundos
    const distanciaMetros = data.routes[0].distance;
    // velocidade media a pé 
    const velocidadeKmH = 4;
    // calculo do tempo em minutos
    const tempoMinutos = Math.round((distanciaMetros / 1000) / velocidadeKmH * 60);
    mostrarNavegacao(distanciaMetros, tempoMinutos);

    map.fitBounds(rotaLayer.getBounds(), {padding:[40,40]});
    } catch (err) {
        console.error("Erro ao calcular rota:", err);
        alert("Não foi possível calcular a rota. Tente novamente mais tarde.");
    }
  };

  //Carregar prédios
  async function carregarPredios() {
  try {
    const resp = await fetch("/api/predios/", {
      credentials: "same-origin",  // garante envio dos cookies
    });

    if (!resp.ok) {
      throw new Error("Não foi possível carregar /api/predios/");
    }

    const dados = await resp.json();

    dados.forEach((p) => {
      const { nome, descricao, coordenadas } = p;

      if (!Array.isArray(coordenadas) || coordenadas.length < 2) {
        console.warn("Coordenadas inválidas para o prédio:", p);
        return;
      }

      const [lat, lng] = coordenadas;

      const marker = L.marker([lat, lng], { icon: iconePredio }).addTo(map);

      marker.bindPopup(`
        <div>
          <strong>${nome}</strong><br/>
          ${descricao ? `<span style="font-size:0.85rem;">${descricao}</span><br/>` : ""}
          <button 
            class="btn-traçar-rota" 
            onclick="irPara(${lat}, ${lng})"
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


// preenche dinamicamente o card com infos da rota (distancia e tempo de caminhada)
}
  function mostrarNavegacao(distancia, tempo) {
  const navCard = document.querySelector('.nav-ativa');
  
  if (!navCard) {
    return;
  }

  let tempoTexto = "";
  if (tempo < 60) {
    tempoTexto = `${tempo} minutos`;
  }
  else {
    const horas = Math.floor(tempo / 60);
    const minutos = tempo % 60;

    if (minutos === 0) {
      tempoTexto = `${horas} h`;
    }
    else {
      tempoTexto = `${horas} h e ${minutos} min`;
    }
  }

  const distanciaTexto = distancia < 1000 
    ? `${Math.round(distancia)} metros` 
    : `${(distancia / 1000).toFixed(2)} km`;
    
    navCard.querySelector('.dados-rota p:nth-child(2)').textContent = tempoTexto;
    navCard.querySelector('.dados-rota p:nth-child(4)').textContent = distanciaTexto;

    navCard.style.display = 'block';
  }
  // configura o botao de fechar no card que mostra o tempo de caminhdada
  const btnFecha = document.querySelector('.nav-ativa .btn-texto');
  if (btnFecha) {
    btnFecha.addEventListener('click', function() {
      event.preventDefault();
      event.stopPropagation();
      document.querySelector('.nav-ativa').style.display = 'none'; // esconde o card quando clica no 'X'
      if (rotaLayer){
        map.removeLayer(rotaLayer); // remove a rota do mapa
      }
    });
  }

 // chama uma vez ao carregar
  localizarUsuario();
  await carregarPredios();

  //
  const urlParam = new URLSearchParams(window.location.search);
  const destLat = urlParam.get('lat');
  const destLng = urlParam.get('lng');

  if (destLat && destLng) {
    setTimeout(() => {
      irPara(parseFloat(destLat), parseFloat(destLng));
    }, 100);
  }
});

