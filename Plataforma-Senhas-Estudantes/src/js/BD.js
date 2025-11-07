const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'inforsenhas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.query('SELECT 1')
  .then(() => console.log('Ligado com sucesso à base de dados (InforSenhas).'))
  .catch((err) => console.error('!!! Erro ao ligar à Base de Dados:', err));

module.exports = pool;