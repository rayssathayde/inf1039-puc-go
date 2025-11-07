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
  
});