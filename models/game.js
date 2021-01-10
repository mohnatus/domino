let unique = 1;

const GAME_READY_EVENT = 'game.events.ready';
const GAME_OPPONENT_CONFIRM_EVENT = 'game.events.opponent.confirm';
const GAME_OPPONENT_GONE_EVENT = 'game.events.opponent.gone';

module.exports = class Game {
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
    player.emitEvent(GAME_READY_EVENT, {
      opponent: {
        id: opponent.id
      }
    });

    player.on('confirm', () => {
      if (opponent.confirm) {
        this.start();
      } else {
        opponent.emitEvent(GAME_OPPONENT_CONFIRM_EVENT);
      }
    })
  }

  get id() {
    return this._id;
  }

  start() {

  }
};
