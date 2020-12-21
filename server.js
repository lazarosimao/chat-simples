const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.use('/', (req, res) => {
  res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
  console.log(`Socket conectado -> ${socket.id}`);

  // Carrega a tela com as mensagens anteriores
  socket.emit('previousMessages', messages);

  // Recebe a mensagem
  socket.on('sendMessage', data => {
    messages.push(data);

    socket.broadcast.emit('receivedMessage', data);
  });
});

server.listen(3000);