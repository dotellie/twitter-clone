<template>
  <div>
    <div v-for="tweet in tweets" :key="tweet.id">
      <twitter-tweet :tweet="tweet"></twitter-tweet>
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
