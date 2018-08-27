import Vue from 'vue';
import '../theme/index.css';
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';

import IndexPage from './pages/index.vue';

Vue.use(ElementUI);
Vue.use(VueRouter);

document.body.innerHTML = `<div></div>`;

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: IndexPage }
  ]
});

const app = new Vue({
  router,
  template: `<router-view></router-view>`
}).$mount(document.querySelector('div'));
