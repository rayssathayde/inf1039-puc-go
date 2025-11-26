document.addEventListener("DOMContentLoaded", async function () {
  const lat = -22.979279047516552; 
  const lon = -43.23199899901637;


  window.map = L.map("map").setView([lat, lon], 17);

  let userMarker = null;

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  navigator.geolocation.getCurrentPosition(success, error);

  function success(pos) {
    const pos_lat = pos.coords.latitude;
    const pos_lng = pos.coords.longitude;

    if (!userMarker) {
      userMarker = L.marker([pos_lat, pos_lng])
    
    if(!userMarker)
    {
      userMarker = L.marker([pos_lat, pos_lng],{icon: iconePredio})
        .addTo(map)
        .bindPopup("Você está aqui")
        .openPopup();
    } else {
      userMarker.setLatLng([pos_lat, pos_lng]);
    }
  }

  function error(err) {
    if (err.code === 1) {
      alert("Permita o site acessar sua localização");
    } else {
      alert("Não foi possível pegar a localização");
    }
  }
  var polygon_puc = L.polygon([
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

  const response = await fetch("/api/predios/");
  const predios = await response.json();

  predios.forEach(p => {
    const marker = L.marker([p.latitude, p.longitude]).addTo(map);

    marker.bindPopup(`
      <b>${p.nome}</b><br>
      <button onclick="irPara(${p.latitude}, ${p.longitude})">
        Traçar rota
      </button>
    `);
  });

  
  map.setView([lat, lon], 17);
});


window.irPara = async function (destLat, destLng) {
  if (!window.map) {
    alert("Mapa não carregado!");
    return;
  }
  
  if (!userMarker) {
    alert("Sua localização ainda não foi carregada!");
    return;
  }

  const origem = userMarker.getLatLng();
  const destino = { lat: destLat, lng: destLng };

  const url = `https://router.project-osrm.org/route/v1/foot/${origem.lng},${origem.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;

  const req = await fetch(url);
  const data = await req.json();
  
  const coords = data.routes[0].geometry.coordinates;
  const latlngs = coords.map(c => [c[1], c[0]]);
  
  if (window.rota) {
    window.map.removeLayer(window.rota);
  }
  
  window.rota = L.polyline(latlngs, { weight: 5 }).addTo(window.map);
  window.map.fitBounds(window.rota.getBounds());
};
  const iconePredio = L.divIcon({
  html: '<i class="fa fa-location-dot" style="color: #030052; font-size: 32px;"></i>',
  className: 'custom-div-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

  async function loadGeoJson()
  {
    try{
      const response = await fetch("/static/data/predios.json");

      if (!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const predios = await response.json();

      predios.forEach(predio => {
        const coordenadas = predio.fields.coordenadas;
        const nome = predio.fields.nome;
        const descricao = predio.fields.descricao;

        L.marker([coordenadas[0], coordenadas[1]], {
        icon: iconePredio
      })
      .addTo(map)
      .bindPopup(`<b>${nome}</b><br>${descricao}`);
      });

    } catch (error) {
      console.log("Erro ao carregar os prédios: ", error);
    }
  }
  loadGeoJson();
});

