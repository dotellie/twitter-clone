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
      <span class="spacer"></span>
      <el-popover
        placement="top"
        width="160"
        v-model="deletePromptVisible">
        <p>Are you sure to delete this tweet?</p>
        <div style="text-align: right;">
          <el-button size="mini" type="text" @click="deletePromptVisible = false">Cancel</el-button>
          <el-button type="primary" size="mini" @click="deleteTweet">Confirm</el-button>
        </div>
        <el-button
          v-if="ownTweet"
          circle
          type="danger"
          icon="el-icon-delete"
          @click="deletePromptVisible = true"
          slot="reference">
        </el-button>
      </el-popover>
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
    data () {
      return {
        deletePromptVisible: false
      }
    },
    computed: {
      isLiked () {
        const { id } = API.getUser();
        return this.tweet.likes.includes(id);
      },
      ownTweet () {
        const { id } = API.getUser();
        return this.tweet['user_id'] === id;
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
      },
      async deleteTweet () {
        await API.del(`/tweet/${this.tweet['tweet_id']}`);
        this.$emit('tweet-remove');
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

  .tweet-footer .spacer {
    flex-grow: 1;
  }
</style>
