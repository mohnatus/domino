<template>
  <div>
    <div>ID: {{ id }}</div>

    <div v-if="gameReady">
      <div v-if="gameStarted"></div>

      <div v-else>
        Второй игрок найден
        <div>ID игрока {{ opponent.id }}</div>


        <div v-if="confirm">
          <div v-if="!opponentConfirm">Ожидаем готовности оппонента...</div>
        </div>
        <div v-else>
          <button @click="start">Начать игру</button>
          <div v-if="opponentConfirm">Оппонент готов начать игру</div>
        </div>
      </div>
    </div>

    <div v-else>Поиск второго игрока...</div>
  </div>
</template>

<script>
// import { io } from 'socket.io-client';
let socket = io();

socket.on('test', () => {
  console.log('test');
});

export default {
  created: function () {
    socket.on('player.events.init', (data) => {
      this.id = data.id;
    });
    socket.on('game.events.ready', (data) => {
      this.gameReady = true;
      this.opponent = data.opponent;
    });
    socket.on('game.events.started', (data) => {
      this.gameStarted = true;
    });
    socket.on('game.events.opponent.confirm', () => {
      this.opponentConfirm = true;
    });
  },
  data() {
    return {
      id: null,
      gameReady: false,
      confirm: false,
      opponent: null,
      opponentConfirm: false,
      gameStarted: false
    };
  },
  methods: {
    start() {
      this.confirm = true;
      socket.emit('player.events.confirm');
    }
  },
  computed: {
    started() {
      return this.confirm && this.opponentConfirm;
    }
  }
};
</script>
