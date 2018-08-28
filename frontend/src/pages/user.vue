<template>
  <div class="twitter-user-feed">
    <twitter-user big :user="$route.params.id"></twitter-user>
    <div v-for="tweet in tweets" :key="tweet['tweet_id']">
      <twitter-tweet :tweet="tweet" @tweet-remove="removeTweet(tweet['tweet_id'])"></twitter-tweet>
    </div>
    <div v-if="tweets.length === 0" class="no-tweets-prompt">
      This user hasn't tweeted anything yet...
    </div>
  </div>
</template>

<script>
  import API from '../api.js';

  import TwitterUser from '../components/user.vue';
  import TwitterTweet from '../components/tweet.vue';

  export default {
    async created () {
      // TODO: handle error
      this.tweets = (await API.get(`/user/${this.$route.params.id}/tweets`)).tweets;
    },
    data () {
      return {
        tweets: []
      }
    },
    components: {
      TwitterUser,
      TwitterTweet
    },
    methods: {
      removeTweet (id) {
        this.tweets = this.tweets.filter(tweet => tweet['tweet_id'] !== id);
      }
    }
  };
</script>

<style>
  .twitter-user-feed .el-card {
    margin: 2em 0;
  }

  .no-tweets-prompt {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
