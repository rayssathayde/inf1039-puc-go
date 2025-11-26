document.addEventListener("DOMContentLoaded", function () {
  const lat = -22.979279047516552; 
  const lon =  -43.23199899901637;
  const map = L.map("map").setView([lat, lon], 17);
  let userMarker = null;

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

navigator.geolocation.getCurrentPosition(success, error);

function success(pos) {
    const pos_lat = pos.coords.latitude;
    const pos_lng = pos.coords.longitude;
    
    if(!userMarker)
    {
      userMarker = L.marker([pos_lat, pos_lng],{icon: iconePredio})
        .addTo(map)
        .bindPopup("Você está aqui")
        .openPopup();
    }
    else{
      userMarker.setLatLng([pos_lat,pos_lng]);
    }
}

function error(err) {
    if (err.code === 1) {
        alert("Permita o site acessar sua localização");
    } else {
        alert("Não foi possível pegar a localização");
    }
}
  map.panTo([lat, lon]);
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

