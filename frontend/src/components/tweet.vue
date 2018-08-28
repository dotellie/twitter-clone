<template>
  <el-card>
    <header slot="header">
      <twitter-user :user="tweet.user_id"></twitter-user>
    </header>
    <article>
      {{tweet['tweet_contents']}}
    </article>
  </el-card>
</template>

<script>
  import API from '../api.js';

  import TwitterUser from './user.vue';

  export default {
    components: {
      TwitterUser
    },
    props: {
      tweet: {
        default: {}
      }
    }
  }
</script>
