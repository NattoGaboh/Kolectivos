const pool = require('../db');

async function getColectivosCercanos(lat, lng, radioMetros = 500) {
  const earthRadius = 6371000; // en metros

  const result = await pool.query(`
    SELECT DISTINCT c.nombre, c.color, c.descripcion,
           p.nombre AS paradero, p.direccion,
           p.latitud, p.longitud,
           (
             ${earthRadius} * acos(
               cos(radians($1)) * cos(radians(p.latitud)) *
               cos(radians(p.longitud) - radians($2)) +
               sin(radians($1)) * sin(radians(p.latitud))
             )
           ) AS distancia
    FROM paraderos p
    JOIN paradero_colectivo pc ON p.id = pc.paradero_id
    JOIN colectivos c ON pc.colectivo_id = c.id
    WHERE (
      ${earthRadius} * acos(
        cos(radians($1)) * cos(radians(p.latitud)) *
        cos(radians(p.longitud) - radians($2)) +
        sin(radians($1)) * sin(radians(p.latitud))
      )
    ) < $3
    ORDER BY distancia ASC
    LIMIT 10;
  `, [lat, lng, radioMetros]);

  return result.rows;
}

module.exports = getColectivosCercanos;
