const express = require('express');
const path = require('path');

const db = require('./Plataforma-Senhas-Estudantes/src/js/BD.js'); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const staticPath = path.join(__dirname, 'Plataforma-Senhas-Estudantes/src');
app.use(express.static(staticPath));

app.post('/login', async (req, res) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password são obrigatórios.' });
  }

  try {
    const query = 'SELECT * FROM Pessoa WHERE Email = ?';
    const [results] = await db.execute(query, [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou password incorretos.' });
    }

    const user = results[0];

    if (password === user.Palavra_Passe) {
      console.log(`Utilizador ${user.Nome} fez login.`);
      res.status(200).json({ 
          message: 'Login bem-sucedido!', 
          redirectTo: '/pages/dashboard.html'
      });
    } else {
      res.status(401).json({ message: 'Email ou password incorretos.' });
    }

  } catch (error) {
    console.error('Erro no endpoint /login:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}/pages/login.html`);
});