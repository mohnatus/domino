const ee = require('event-emitter');

let unique = 1;

const PLAYER_INIT_EVENT = 'player.events.init';
const PLAYER_CONFIRM_EVENT = 'player.events.confirm';

module.exports = class Player {
  constructor(socket) {
    ee(this);

    this._id = unique++;
    this._socket = socket;
    this._game = null;
    this.confirm = false;

    this.emitEvent(PLAYER_INIT_EVENT, {
      id: this._id
    });

    this._socket.on(PLAYER_CONFIRM_EVENT, () => {
      this.confirm = true;
      this.emit('confirm');
    });
  }

  get id() {
    return this._id;
  }

  get game() {
    return this._game;
  }
  set game(game) {
    this._game = game;
  }

  emitEvent(eventName, eventData) {
    console.log('emit event', eventName, this._id);
    this._socket.emit(eventName, eventData);
    console.log('emited');
  }
};

module.exports.PLAYER_INIT_EVENT = PLAYER_INIT_EVENT;
module.exports.PLAYER_CONFIRM_EVENT = PLAYER_CONFIRM_EVENT;
