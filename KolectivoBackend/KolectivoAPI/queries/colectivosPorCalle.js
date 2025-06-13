const pool = require('../db');

async function getColectivosPorCalle(calle) {
  const result = await pool.query(`
    SELECT DISTINCT c.nombre, c.color, c.descripcion
    FROM colectivos c
    JOIN rutas_colectivo rc ON c.id = rc.colectivo_id
    JOIN calles ca ON rc.calle_id = ca.id
    WHERE ca.nombre ILIKE $1
  `, [calle]);
  return result.rows;
}

module.exports = getColectivosPorCalle;
