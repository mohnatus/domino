const Player = require('./player');
const Pair = require('./pair');

const gameEvents = require('../data/game.events');
const playerEvents = require('../data/player.events');

module.exports = class Game {
  constructor() {
    this.players = [];
    this.waiting = [];
    this.pairs = [];
  }

  addConnection(socket) {
    let player = new Player(socket);
    this.players.push(player);

    player.on(playerEvents.DISCONNECTED, () => {
      let index = this.players.findIndex((p) => p === player);
      this.players.splice(index, 1);
    });

    player.on(playerEvents.FIND_OPPONENT, () => {
      if (this.waiting.length) {
        let player2 = this.waiting.shift();
        let pair = new Pair(player, player2);
        this.pairs.push(pair);
      } else {
        this.waiting.push(player);
      }
    });
  }
};
