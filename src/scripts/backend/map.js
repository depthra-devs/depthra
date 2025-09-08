const map = L.map("map").setView([20.5937, 78.9629], 5); // Center on India

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let marker;

map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lng]).addTo(map);

  document.getElementById("coords").textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

});