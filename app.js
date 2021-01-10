const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

const server = http.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port: %s', server.address().port);
});

let waiting = [];
let games = [];

const Player = require('./models/player');
const Game = require('./models/game');

io.on('connection', function (socket) {
  console.log(
    'new connection',
    waiting.map((p) => p.id)
  );
  let player = new Player(socket);
  console.log('new player id', player.id);

  if (waiting.length) {
    let player2 = waiting.shift();
    console.log(
      'has waiting',
      player2.id,
      waiting.map((p) => p.id)
    );
    let game = new Game(player, player2);
    games.push(game);
  } else {
    console.log('no waiting');
    waiting.push(player);
  }

  socket.on('disconnect', () => {
    console.log('player disconnected');
    if (player.game) {
      // перевести второго игрока в режим ожидания
    }

    // удалить игрока
  });
});

// function sendCode() {
//   let x = Math.random();
//   io.sockets.emit('code', {
//     code: x
//   });
//   io.sockets.emit('player', {
//     players: players
//   });
// }

setTimeout(() => {
  io.sockets.emit('test', {});
}, 1000);
