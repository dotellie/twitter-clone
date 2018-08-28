<template>
  <div>
    <div class="twitter-shell-header">
      <span class="twitter-shell-title">Twitter Clone</span>

      <span class="spacer"></span>

      <nav :hidden="!showNav">
        <router-link to="/explore" class="link">Explore</router-link>
        <router-link to="/home" class="link">Timeline</router-link>
        <router-link to="/account" class="link">Account Settings</router-link>
        <a href="#" class="link" @click="logout">Sign Out</a>
      </nav>
    </div>
    <div class="twitter-shell-content">
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import API from './api.js';

  export default {
    props: [
      'showNav'
    ],
    methods: {
      async logout () {
        await API.post('/account/logout');
        this.$router.push('/');
        location.reload();
      }
    }
  }
</script>

<style>
  .twitter-shell-header {
    display: flex;
    align-items: center;
    margin: 3em;
  }

  .twitter-shell-header .twitter-shell-title {
    font-size: 2em;
  }

  .twitter-shell-header .spacer {
    flex-grow: 1;
  }

  .twitter-shell-header .link {
    margin: 0 0.5em;
    color: black;
  }

  .twitter-shell-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .twitter-shell-content > div {
    max-width: 45em;
    flex-grow: 1;
  }
</style>
