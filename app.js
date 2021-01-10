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


const Game = require('./models/game');
const game = new Game();

io.on('connection', function (socket) {
  game.addConnection(socket);
});



// setTimeout(() => {
//   io.sockets.emit('test', {});
// }, 1000);
