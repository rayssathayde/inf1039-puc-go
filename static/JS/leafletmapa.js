document.addEventListener("DOMContentLoaded", function () {
  const lat = -22.979279047516552; 
  const lon =  -43.23199899901637;
  const map = L.map("map").setView([lat, lon], 17);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const marker = L.marker([lat, lon]).addTo(map);
  map.panTo([lat, lon]);
  
  const btnLocalizacao = document.querySelector(".btn-localizacao");


  if (btnLocalizacao) {
    btnLocalizacao.addEventListener("click", () => {
      map.locate({ setView: true, maxZoom: 20 });
    });

    map.on("locationfound", function (e) {
      L.marker(e.latlng)
        .addTo(map)
        .bindPopup("Você está aqui")
        .openPopup();
    });

    map.on("locationerror", function (e) {
      alert("Não foi possível obter sua localização: " + e.message);
    });
  }
});
