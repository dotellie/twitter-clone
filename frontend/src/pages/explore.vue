<template>
  <div>
    <el-card v-for="user in users" :key="user.id">
      <twitter-user :user="user.id"></twitter-user>
    </el-card>
  </div>
</template>

<script>
  import TwitterUser from '../components/user.vue';

  export default {
    async created () {
      // TODO: handle error
      this.users = (await API.get('/user/list-all')).users;
    },
    data () {
      return {
        users: []
      }
    },
    components: {
      TwitterUser
    }
  }
</script>
