const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./Plataforma-Senhas-Estudantes/src/js/BD.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'muda-isto-para-uma-frase-longa-e-aleatoria', 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 2 
  }
}));

const staticPath = path.join(__dirname, 'Plataforma-Senhas-Estudantes/src');
app.use(express.static(staticPath));

async function isValidPassword(plainPassword, dbPassword) {
    const looksHashed = typeof dbPassword === 'string' && /^\$2[aby]\$/.test(dbPassword);
    if (looksHashed) {
        try { return await bcrypt.compare(plainPassword, dbPassword); } 
        catch (err) { return false; }
    } else {
        return plainPassword === dbPassword;
    }
}

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Não autorizado. Por favor, faça login.' });
  }
};

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password são obrigatórios.' });
  }

  try {
    const query = 'SELECT P.Id_Pessoa, P.Nome, P.Email, P.Palavra_Passe, P.Foto, Adm.Id_Administrador, Aux.Id_Auxiliar, Al.Id_Aluno FROM Pessoa AS P LEFT JOIN Administrador AS Adm ON P.Id_Pessoa = Adm.Pessoa LEFT JOIN Auxiliar AS Aux ON P.Id_Pessoa = Aux.Pessoa LEFT JOIN Aluno AS Al ON P.Id_Pessoa = Al.Pessoa WHERE P.Email = ?';
    const [results] = await db.execute(query, [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou password incorretos.' });
    }

    const user = results[0];
    const passwordMatches = await isValidPassword(password, user.Palavra_Passe);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Email ou password incorretos.' });
    }

    let role = 'user';
    let redirectTo = '/pages/index.html';

    if (user.Id_Administrador) { role = 'admin'; redirectTo = '/pages/admin.html'; } 
    else if (user.Id_Auxiliar) { role = 'auxiliar'; redirectTo = '/pages/painelfunc.html'; } 
    else if (user.Id_Aluno) { role = 'aluno'; redirectTo = '/pages/dashboard.html'; }
    
    req.session.user = {
      id: user.Id_Pessoa,
      nome: user.Nome,
      email: user.Email,
      foto: user.Foto,
      role: role
    };

    console.log(`Utilizador ${user.Nome} fez login como: ${role}. Sessão guardada.`);

    res.status(200).json({
      message: 'Login bem-sucedido!',
      role,
      redirectTo
    });

  } catch (error) {
    console.error('Erro no endpoint /login:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer logout.' });
    }
    res.clearCookie('connect.sid'); 
    res.status(200).json({ message: 'Logout bem-sucedido.', redirectTo: '/pages/login.html' });
  });
});

app.get('/api/me', isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.session.user });
});

app.get('/api/senhas/disponiveis', isAuthenticated, async (req, res) => {
  if (req.session.user.role !== 'aluno') {
    return res.status(403).json({ message: 'Acesso negado. Apenas para alunos.' });
  }
  
  try {
    const pessoaId = req.session.user.id;

    const query = "SELECT COUNT(s.Id_Senha) AS quantidade FROM Senha AS s JOIN Estado AS e ON s.Estado = e.Id_Estado JOIN Compra AS c ON s.Compra = c.Id_Compra JOIN Aluno AS a ON c.Aluno = a.Id_Aluno WHERE a.Pessoa = ? AND e.Estado = 'Ativo'";

    const [results] = await db.execute(query, [pessoaId]);
    
    res.status(200).json(results[0]); 

  } catch (error) {
    console.error('Erro ao buscar quantidade de senhas:', error);
    res.status(500).json({ message: 'Erro interno ao buscar senhas.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}/pages/login.html`);
});