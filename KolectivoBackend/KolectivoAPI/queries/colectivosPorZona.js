const pool = require('../db');

async function getColectivosPorZona(zona) {
  const result = await pool.query(`
    SELECT DISTINCT c.nombre, c.color, c.descripcion
    FROM colectivos c
    JOIN rutas_colectivo rc ON c.id = rc.colectivo_id
    JOIN calles ca ON rc.calle_id = ca.id
    JOIN zonas z ON ca.zona_id = z.id
    WHERE z.nombre ILIKE $1
  `, [zona]);
  return result.rows;
}

module.exports = getColectivosPorZona;
