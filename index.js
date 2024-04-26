const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3333;

// Conecta ao banco de dados MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase')
.then(() => {
  console.log('Conectado ao MongoDB.');
})
.catch((error) => {
  console.error('Erro na conexão com o MongoDB:', error);
});

// Middleware para analisar dados JSON
app.use(bodyParser.json());

// Middleware CORS para permitir requisições de todas as origens
app.use(cors());

// Definição do modelo do usuário
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  whatsapp: String,
  idea: String,
  currentPhase: String
});
const User = mongoose.model('User', userSchema);

// Rota POST para receber dados do front-end e cadastrar um novo usuário
app.post('/users', (req, res) => {
  const { name, email, whatsapp, idea, currentPhase } = req.body;

  // Cria um novo usuário com os dados recebidos
  const newUser = new User({ name, email, whatsapp, idea, currentPhase });

  // Salva o novo usuário no banco de dados
  newUser.save()
    .then(() => {
      res.status(201).send('Usuário cadastrado com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao salvar usuário:', error);
      res.status(500).send('Erro ao salvar usuário.');
    });
});

// Rota GET para recuperar todos os usuários cadastrados
app.get('/users', (req, res) => {
  // Busca todos os usuários no banco de dados
  User.find({})
    .then((users) => {
      res.status(200).json(users); // Retorna os usuários encontrados como JSON
    })
    .catch((error) => {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).send('Erro ao buscar usuários.');
    });
});

// Inicializa o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}.`);
});
