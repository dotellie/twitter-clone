import Vue from 'vue';

import HomePage from './pages/home.vue';

document.body.innerHTML = `<div><home-page></home-page></div>`;

const app = new Vue({
  components: { HomePage },
  el: document.querySelector('div')
});
