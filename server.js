const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de PostgreSQL (usar variables de entorno en .env)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'productsdb',
  port: process.env.DB_PORT || 5432,
});

// Inicializar base de datos
async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const res = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(res.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO products (name, category, quantity, price, description)
        VALUES 
        ('Laptop Pro', 'Electronics', 15, 1299.99, 'High-performance laptop'),
        ('Wireless Mouse', 'Electronics', 45, 29.99, 'Ergonomic wireless mouse'),
        ('Office Chair', 'Furniture', 8, 199.99, 'Comfortable office chair');
      `);
    }
  } finally {
    client.release();
  }
}

initDB().catch(err => console.error('Error initializing DB', err));

// Rutas
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
