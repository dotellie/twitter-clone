<template>
  <div class="twitter-home">
    <el-card>
      <el-input
        type="textarea"
        placeholder="Tweet something!"
        v-model="tweetContent"
        :rows="4">
      </el-input>
      <el-button type="primary" style="margin: 1em 0; float: right;" @click="tweet">
        Tweet
      </el-button>
    </el-card>
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
        tweets: [],
        tweetContent: ''
      }
    },
    components: {
      TwitterTweet
    },
    methods: {
      async tweet () {
        const { tweet } = await API.post('/tweet/insert', {
          contents: this.tweetContent
        });
        this.tweets.unshift(tweet);
        this.tweetContent = '';
      }
    }
  };
</script>

<style>
  .twitter-home .el-card {
    margin: 2em 0;
  }

  .explore-prompt {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .explore-prompt a {
    color: white;
  }
</style>
