import Vue from 'vue';
import '../theme/index.css';
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';

import TwitterShell from './shell.vue';

import IndexPage from './pages/index.vue';
import HomePage from './pages/home.vue';
import ExplorePage from './pages/explore.vue';

Vue.use(ElementUI);
Vue.use(VueRouter);

document.body.innerHTML = `<div></div>`;

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: IndexPage },
    { path: '/home', component: HomePage },
    { path: '/explore', component: ExplorePage }
  ]
});

const app = new Vue({
  router,
  created () {
    router.beforeEach((to, _, next) => {
      this.showNav = to.path !== '/';
      next();
    });
  },
  data () {
    return {
      showNav: false
    };
  },
  components: {
    TwitterShell
  },
  template: `<twitter-shell :show-nav="showNav"><router-view></router-view></twitter-shell>`
}).$mount(document.querySelector('div'));
