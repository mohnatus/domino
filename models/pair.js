let unique = 1;

const events = require('../data/game.events');

module.exports = class Pair {
  constructor(player1, player2) {
    this._id = unique++;
    this._player1 = player1;
    this._player2 = player2;

    player1.game = this._id;
    player2.game = this._id;

    this.handlePlayer(player1, player2);
    this.handlePlayer(player2, player1);
  }

  handlePlayer(player, opponent) {
    player._confirmed = false;

    player.emit(events.OPPONENT_FOUND, {
      opponent: {
        id: opponent.id
      }
    });

    player.on(events.PLAYER_CONFIRM, (cb) => {
      player._confirmed = true;
      if (opponent._confirmed) {
        this.start();
      } else {
        cb();
        opponent.emit(events.OPPONENT_CONFIRM);
      }
    });

    player.on('disconnected', () => {
      opponent.emit(events.OPPONENT_GONE);
    });
  }

  get id() {
    return this._id;
  }

  start() {
    this._player1.emit(events.START);
    this._player2.emit(events.START);
  }
};
