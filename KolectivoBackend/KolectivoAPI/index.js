const express = require('express');
const cors = require('cors');
require('dotenv').config();

const getColectivosPorCalle = require('./queries/colectivosPorCalle');
const getColectivosPorZona = require('./queries/colectivosPorZona');
const getColectivosCercanos = require('./queries/colectivosCercanos');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint: /calle?nombre=Av. Pacífico
app.get('/calle', async (req, res) => {
  const nombre = req.query.nombre;
  if (!nombre) return res.status(400).json({ error: 'Falta el nombre de la calle' });
  const data = await getColectivosPorCalle(nombre);
  res.json(data);
});

// Endpoint: /zona?nombre=Coishco
app.get('/zona', async (req, res) => {
  const nombre = req.query.nombre;
  if (!nombre) return res.status(400).json({ error: 'Falta el nombre de la zona' });
  const data = await getColectivosPorZona(nombre);
  res.json(data);
});


// Endpoint: /cercanos?lat=-9.075&lng=-78.592&radio=500
app.get('/cercanos', async (req, res) => {
  const { lat, lng, radio } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Faltan parámetros lat o lng' });
  }

  const data = await getColectivosCercanos(parseFloat(lat), parseFloat(lng), parseFloat(radio) || 500);
  res.json(data);
});


app.listen(port, () => {
  console.log(`API de colectivos corriendo en http://localhost:${port}`);
});
