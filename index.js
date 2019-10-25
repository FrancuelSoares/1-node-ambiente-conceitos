const express = require('express');

const server = express();
server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { nome: 'Françuel' }

const users = ['Diego', 'Françuel', 'Taynar'];


// Middlewares Global
server.use((req, res, next) => {

  console.log(`Método: ${req.method}; URL: ${req.url}`);

  return next();
});

// Middlewares Local
function checkUserExists(req, res, next) {

  if (!req.body.nome) {
    return res.status(400).json({ error: 'Campo nome é obrigatório!' });
  }

  return next();
}

function checkUserId(req, res, next) {

  const user = users[req.params.id];

  if (!user) {
    return res.status(400).json({ error: 'Usuário não existe!' });
  }

  req.user = user;

  return next();
}


server.get('/users', (req, res) => {

  return res.json(users);
});

server.get('/users/:id', checkUserId, (req, res) => {
  return res.json(req.user);
});


server.post('/users', checkUserExists, (req, res) => {

  const { nome } = req.body;

  users.push(nome);

  return res.json({ users });
});


server.put('/users/:id', checkUserId, checkUserExists, (req, res) => {

  const { id } = req.params;
  const { nome } = req.body;

  users[id] = nome;

  return res.json(users);
});


server.delete('/users/:id', checkUserId, (req, res) => {

  const { id } = req.params;

  users.splice(id, 1);

  return res.send();
});

server.listen(3000);