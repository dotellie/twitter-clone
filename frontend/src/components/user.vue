<template>
  <div :class="'twitter-user ' + bigClass">
    <router-link :to="'/user/' + user" class="twitter-user-link">
      <img :src="avatarUrl + (big ? '?s=200' : '')" class="profile-picture">

      <div class="twitter-user-names">
        <span>{{name}}</span>
        <span>@{{handle}}</span>
      </div>
    </router-link>

    <el-button
      v-if="!big"
      style="float: right;"
      @click="toggleFollow"
      round
      :type="buttonType">
      {{buttonText}}
    </el-button>
  </div>
</template>

<script>
  class UserCache {
    constructor () {
      this.cached = {};
      this.listeners = [];
    }

    async getUser (id) {
      const cached = this.cached[id];
      if (cached) return cached;

      const request = new Promise((resolve, reject) => {
        API.get(`/user/${id}`).then(
          ({ user }) => resolve(user),
          e => reject(e)
        );
      })
      // Storing both the request and the result reduces cache misses
      this.cached[id] = request;
      const user = await request;
      this.cached[id] = user;
      return user;
    }

    setUserInfo (id, userInfo) {
      // FIXME: This method can fail if the request isn't finished but cached
      const user = this.cached[id];
      Object.keys(userInfo).forEach(key => {
        user[key] = userInfo[key];
      });
      this.alertMutation(id, user);
    }

    addMutationListener (callback) {
      this.listeners.push(callback);
    }

    removeMutationListener (callback) {
      this.listeners.splice(this.listeners.indexOf(callback), 1);
    }

    alertMutation (id, newUser) {
      this.listeners.forEach(callback => callback(id, newUser));
    }
  }

  const userCache = new UserCache();

  export default {
    props: {
      user: {},
      big: {
        type: Boolean
      }
    },
    data () {
      return {
        name: '',
        handle: '',
        avatarUrl: '',
        following: false,
      };
    },
    computed: {
      buttonType () {
        return this.following ? 'primary' : '';
      },
      buttonText () {
        return this.following ? 'Unfollow' : 'Follow';
      },
      bigClass () {
        return this.big ? 'big' : '';
      }
    },
    created () {
      if (this.user) {
        this.fetchUserData(this.user);
      }
      this.userCacheCallback = this.updateUser.bind(this);
      userCache.addMutationListener(this.userCacheCallback);
    },
    destroyed () {
      userCache.removeMutationListener(this.userCacheCallback);
    },
    watch: {
      user (value) {
        this.fetchUserData(value);
      }
    },
    methods: {
      async fetchUserData (id) {
        const user = await userCache.getUser(id);
        this.updateUser(id, user);
      },
      updateUser (id, user) {
        if (id === this.user) {
          this.name = user.name;
          this.handle = user.handle;
          this.avatarUrl = user.avatarUrl;
          this.following = user.following;
        }
      },
      async toggleFollow () {
        try {
          if (!this.following) {
            await API.post(`/user/${this.user}/follow`);
          } else {
            await API.post(`/user/${this.user}/unfollow`);
          }
        } catch (e) {}

        userCache.setUserInfo(this.user, {
          following: !this.following
        });
      }
    }
  }
</script>

<style>
  .twitter-user {
    display: flex;
    align-items: center;
  }

  .twitter-user.big {
    flex-direction: column;
    font-size: 2em;
  }

  .twitter-user-link {
    display: flex;
    align-items: center;
    flex-grow: 1;
    color: unset;
    text-decoration: unset;
  }

  .twitter-user .profile-picture {
    border-radius: 50%;
  }

  .twitter-user.big .profile-picture {
    width: 5em;
    height: auto;
  }

  .twitter-user .twitter-user-names {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 0 1.5em;
  }

  .twitter-user .twitter-user-names span:last-child {
    font-size: 0.8em;
    color: grey;
    margin-top: 0.5em;
  }
</style>
