<template>
  <el-card>
    <header slot="header">
      <twitter-user :user="tweet.user_id"></twitter-user>
    </header>
    <article>
      {{tweet['tweet_contents']}}
    </article>
    <div class="tweet-footer">
      <el-button
        circle
        :type="isLiked ? 'success' : ''"
        :icon="isLiked ? 'el-icon-star-on' : 'el-icon-star-off'"
        @click="toggleLike">
      </el-button>
      <span>{{tweet.likes.length}}</span>
    </div>
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
    },
    computed: {
      isLiked () {
        const { id } = API.getUser();
        return this.tweet.likes.includes(id);
      }
    },
    methods: {
      async toggleLike () {
        const { id } = API.getUser();

        if (this.isLiked) {
          await API.post(`/tweet/${this.tweet['tweet_id']}/dislike`);
          this.tweet.likes.splice(this.tweet.likes.indexOf(id));
        } else {
          await API.post(`/tweet/${this.tweet['tweet_id']}/like`);
          this.tweet.likes.push(id);
        }
      }
    }
  }
</script>

<style>
  .tweet-footer {
    display: flex;
    align-items: center;
    margin-top: 1em;
  }

  .tweet-footer > *:not(:last-child) {
    margin-right: 1em;
  }
</style>
