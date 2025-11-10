const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'inforsenhas'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Ligado ao Inforsenhas!');
});
