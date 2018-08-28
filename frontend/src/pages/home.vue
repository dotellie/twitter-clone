<template>
  <div>
    <div v-for="tweet in tweets" :key="tweet.id">
      <twitter-tweet :tweet="tweet"></twitter-tweet>
    </div>
    <div v-if="tweets.length === 0" class="explore-prompt">
      <el-button type="primary">
        <router-link to="/explore">Go find some people to follow</router-link>
      </el-button>
    </div>
  </div>
</template>

<script>
  import API from '../api.js';

  import TwitterTweet from '../components/tweet.vue';

  export default {
    async created () {
      // TODO: handle error
      this.tweets = (await API.get('/tweet/list-all')).tweets;
    },
    data () {
      return {
        tweets: []
      }
    },
    components: {
      TwitterTweet
    }
  };
</script>

<style>
  .explore-prompt {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .explore-prompt a {
    color: white;
  }
</style>
