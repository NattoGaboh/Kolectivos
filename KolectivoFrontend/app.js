const API_URL = 'http://localhost:3000'; // cambia si tu API está en otro host
const calleInput = document.getElementById('calle');
const zonaInput = document.getElementById('zona');
const buscarBtn = document.getElementById('buscar');
const ubicacionBtn = document.getElementById('ubicacion');
const lista = document.getElementById('lista');

// Iniciar mapa
let map = L.map('mapa').setView([-9.075, -78.593], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
let markers = [];

// Limpiar marcadores anteriores
function limpiarMapa() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

// Mostrar resultados
function mostrarResultados(data) {
  lista.innerHTML = '';
  limpiarMapa();

  if (!data || data.length === 0) {
    lista.innerHTML = '<p>No se encontraron colectivos.</p>';
    return;
  }

  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'resultado';
    div.innerHTML = `
      <strong style="color:${item.color || 'black'}">${item.nombre}</strong><br/>
      ${item.descripcion || ''}<br/>
      ${item.paradero ? `Paradero: ${item.paradero} (${Math.round(item.distancia)} m)` : ''}
    `;
    lista.appendChild(div);

    if (item.latitud && item.longitud) {
      const marker = L.marker([item.latitud, item.longitud])
        .addTo(map)
        .bindPopup(`<strong>${item.nombre}</strong><br/>${item.paradero || ''}`);
      markers.push(marker);
    }
  });
}

// Buscar por calle o zona
buscarBtn.addEventListener('click', async () => {
  const calle = calleInput.value.trim();
  const zona = zonaInput.value.trim();

  let endpoint = '';
  if (calle && zona) {
    alert('Por favor, usa solo calle o zona, no ambos.');
    return;
  } else if (calle) {
    endpoint = `/calle?nombre=${encodeURIComponent(calle)}`;
  } else if (zona) {
    endpoint = `/zona?nombre=${encodeURIComponent(zona)}`;
  } else {
    alert('Escribe una calle o una zona.');
    return;
  }

  const res = await fetch(`${API_URL}${endpoint}`);
  const data = await res.json();
  mostrarResultados(data);
});

// Buscar por ubicación
ubicacionBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Tu navegador no soporta geolocalización.');
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    const res = await fetch(`${API_URL}/cercanos?lat=${latitude}&lng=${longitude}&radio=700`);
    const data = await res.json();
    map.setView([latitude, longitude], 15);
    L.marker([latitude, longitude]).addTo(map).bindPopup('Tu ubicación').openPopup();
    mostrarResultados(data);
  }, () => {
    alert('No se pudo obtener tu ubicación.');
  });
});
