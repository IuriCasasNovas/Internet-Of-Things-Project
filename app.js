const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

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

    let passwordMatches = false;
    try {
      const looksHashed = typeof user.Palavra_Passe === 'string' && /^\$2[aby]\$/.test(user.Palavra_Passe);
      if (looksHashed) {
        passwordMatches = await bcrypt.compare(password, user.Palavra_Passe);
      } else {
        passwordMatches = password === user.Palavra_Passe;
      }
    } catch (err) {
      console.error('Erro a verificar password:', err);
      passwordMatches = password === user.Palavra_Passe;
    }

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Email ou password incorretos.' });
    }

    const pessoaId = user.Id_Pessoa || user.id || user.Id || null;

    let role = 'aluno';
    let redirectTo = '/pages/dashboard.html';

    if (pessoaId) {
      const [adminRows] = await db.execute('SELECT Id_Administrador FROM Administrador WHERE Pessoa = ?', [pessoaId]);
      if (adminRows && adminRows.length > 0) {
        role = 'admin';
        redirectTo = '/pages/admin.html';
      } else {
        const [auxRows] = await db.execute('SELECT Id_Auxiliar FROM Auxiliar WHERE Pessoa = ?', [pessoaId]);
        if (auxRows && auxRows.length > 0) {
          role = 'auxiliar';
          redirectTo = '/pages/painelfunc.html';
        } else {
          const [alunoRows] = await db.execute('SELECT Id_Aluno FROM Aluno WHERE Pessoa = ?', [pessoaId]);
          if (alunoRows && alunoRows.length > 0) {
            role = 'aluno';
            redirectTo = '/pages/dashboard.html';
          } else {
            role = 'user';
            redirectTo = '/pages/index.html';
          }
        }
      }
    }

    console.log(`Utilizador ${user.Nome} (id=${pessoaId}) fez login como: ${role}`);

    res.status(200).json({
      message: 'Login bem-sucedido!',
      role,
      redirectTo,
      user: {
        id: pessoaId,
        nome: user.Nome,
        email: user.Email
      }
    });

  } catch (error) {
    console.error('Erro no endpoint /login:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}/pages/login.html`);
});