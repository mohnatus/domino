const ee = require('event-emitter');
const states = require('../data/player.states');
const playerEvents = require('../data/player.events');
const gameEvents = require('../data/game.events');

let unique = 1;

module.exports = class Player {
  constructor(socket) {
    ee(this);

    this._id = unique++;
    this._socket = socket;
    this._game = null;

    this._state = states.PASSIVE;

    this.emitEvent(playerEvents.INIT, {
      id: this._id
    });

    // Кнопка Искать соперника
    this._socket.on(playerEvents.FIND_OPPONENT, () => {
      this.state = states.WAITING_OPPONENT;
      this.emit(playerEvents.FIND_OPPONENT);
    });

    // Соперник найден
    this.on(gameEvents.OPPONENT_FOUND, (data) => {
      this.emitEvent(gameEvents.OPPONENT_FOUND, data);
      this.state = states.WAITING_CONFIRM;
    });

    // Подтвердить участие
    this._socket.on(gameEvents.PLAYER_CONFIRM, () => {
      this.emit(gameEvents.PLAYER_CONFIRM, () => this.state = states.WAITING_OPPONENT_CONFIRM);
    });

    // Противник подтвердил участие
    this.on(gameEvents.OPPONENT_CONFIRM, () => {
      this.emitEvent(gameEvents.OPPONENT_CONFIRM);
    });

    // Противник подтвердил участие
    this.on(gameEvents.START, () => {
      this.state = states.ACTIVE;
    });

    // Противник вышел из игры
    this.on(gameEvents.OPPONENT_GONE, () => {
      // TODO
      this.state = states.PASSIVE;
    });

    // Игрок отключился
    this._socket.on('disconnect', () => {
      this.emit(playerEvents.DISCONNECTED);
    });
  }

  emitEvent(eventName, eventData) {
    this._socket.emit(eventName, eventData);
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

  get state() {
    return this._state;
  }
  set state(s) {
    console.log('change state', s);
    this._state = s;
    this.emitEvent(playerEvents.CHANGE_STATE, {
      state: s
    });
  }
};
