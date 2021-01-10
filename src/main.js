import 'regenerator-runtime/runtime';

import Vue from 'vue/dist/vue.js';;
import App from './components/app/index.vue';

Vue.component('domino-app', App);

new Vue({
  el: '#app',
  template: '<domino-app></domino-app>'
});

// function movement() {
//   socket.emit('movement', {
//     x: 100,
//     y: 200
//   });
// }
