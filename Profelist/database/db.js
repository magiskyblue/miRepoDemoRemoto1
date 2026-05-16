const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'profe_list',
  waitForConnections: true,
  connectionLimit: 10
};

const pool = mysql.createPool(dbConfig);

const DatabaseManager = {
  pool,
  async init() {
    const rootConn = await mysql.createConnection({ host: dbConfig.host, user: dbConfig.user, password: dbConfig.password });
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await rootConn.end();

    const db = await pool.getConnection();
    
    const schemas = [
      `CREATE TABLE IF NOT EXISTS grupos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS alumnos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        grupo_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS asistencias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        alumno_id INT NOT NULL,
        fecha DATE NOT NULL,
        presente BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
        UNIQUE KEY unique_asistencia (alumno_id, fecha)
      )`
    ];

    for (const query of schemas) {
      await db.query(query);
    }
    db.release();
  }
};

module.exports = { pool: DatabaseManager.pool, initDB: DatabaseManager.init };