require('dotenv').config();

const express = require('express');
const app = express();
const { Pool } = require('pg');
const path = require('path');

// Configuración de la conexión a PostgreSQL
const isSSL = process.env.DB_SSL === 'true';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
});

// Middleware para procesar datos en formato JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para insertar datos
app.post('/guardar', async (req, res) => {
  const { campo1, campo2, campo3 } = req.body;
  try {
    await pool.query('INSERT INTO datos (campo1, campo2, campo3) VALUES ($1, $2, $3)', [campo1, campo2, campo3]);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.send('Error al guardar los datos');
  }
});

// Ruta para obtener datos
app.get('/obtener-datos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM datos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.send('Error al obtener los datos');
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
