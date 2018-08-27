import Vue from 'vue';
import '../theme/index.css';
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';

import HomePage from './pages/home.vue';

Vue.use(ElementUI);
Vue.use(VueRouter);

document.body.innerHTML = `<div><home-page></home-page></div>`;

const app = new Vue({
  components: { HomePage },
  el: document.querySelector('div')
});
