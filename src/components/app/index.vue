<template>
  <div>
    <div v-if="started">игра началась</div>

    <div v-else>
      <div>ID: {{ id }}</div>

      <div v-if="state == states.PASSIVE">
        <button @click="findOpponent">Искать соперника</button>
      </div>

      <div v-else-if="state == states.WAITING_OPPONENT">
        Поиск второго игрока...
      </div>

      <div v-else>
        Второй игрок найден
        <div>ID игрока {{ opponent.id }}</div>

        <div v-if="state == states.WAITING_CONFIRM">
          <button @click="confirm">Начать игру</button>
          <div v-if="opponentConfirm">Оппонент готов начать игру</div>
        </div>

        <div v-else-if="state == states.WAITING_OPPONENT_CONFIRM">
          Ожидаем готовности оппонента...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import states from '../../../data/player.states';
import playerEvents from '../../../data/player.events';
import gameEvents from '../../../data/game.events';

// import { io } from 'socket.io-client';
let socket = io();

socket.on('test', () => {
  console.log('test');
});

export default {
  created: function () {
    socket.on(playerEvents.INIT, (data) => {
      this.id = data.id;
    });
    socket.on(playerEvents.CHANGE_STATE, (data) => {
      console.log('state', data.state)
      this.state = data.state;
    });
    socket.on(gameEvents.OPPONENT_FOUND, (data) => {
      this.opponent = data.opponent;
    });
    socket.on(gameEvents.OPPONENT_CONFIRM, (data) => {
      this.opponentConfirm = true;
    });
  },
  data() {
    return {
      id: null,
      states,
      state: 'passive',
      opponent: null,
      opponentConfirm: false,
    };
  },
  methods: {
    findOpponent() {
      socket.emit(playerEvents.FIND_OPPONENT);
    },
    confirm() {
      console.log('confirm')
      socket.emit(gameEvents.PLAYER_CONFIRM);
    }
  },
  computed: {
    started() {
      return this.state == this.states.ACTIVE;
    }
  }
};
</script>
