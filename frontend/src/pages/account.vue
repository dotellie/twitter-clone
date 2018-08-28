<template>
  <div class="twitter-account-settings">
    <h1>Account Settings</h1>
    <span>
      Leave the new password field empty if you don't want to change it.
      Your current password is always required to make changes.
    </span>
    <el-form
      ref="settingsForm"
      :model="settings"
      :rules="settingsRules"
      label-width="150px">
      <el-form-item label="Username (handle)" prop="newHandle" :error="settingsErrors.newHandle">
        <el-input v-model="settings.newHandle"></el-input>
      </el-form-item>
      <el-form-item label="New password" prop="newPassword">
        <el-input type="password" v-model="settings.newPassword"></el-input>
      </el-form-item>
      <hr>
      <el-form-item label="Current password" prop="currentPassword" :error="settingsErrors.currentPassword">
        <el-input type="password" v-model="settings.currentPassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="makeChanges()">Apply</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import API from '../api.js';

  export default {
    data () {
      return {
        settings: {
          newHandle: API.getUser().handle,
          newPassword: '',
          currentPassword: ''
        },
        settingsRules: {
          newHandle: {
            required: true, message: 'Please input your desired username', trigger: 'change'
          },
          currentPassword: {
            required: true, message: 'Please input your current password', trigger: 'change'
          }
        },
        settingsErrors: {
          newHandle: '',
          currentPassword: ''
        }
      }
    },
    methods: {
      makeChanges () {
        Object.keys(this.settingsErrors).forEach(k => this.settingsErrors[k] = '');
        this.$refs.settingsForm.validate(async valid => {
          if (valid) {
            try {
              const resp = await API.post('/account/update-info', this.settings);
              API.setUser();
              this.$router.push('/');
              location.reload();
            } catch (e) {
              console.log(e);
              if (e.invalidFields) {
                for (const field of e.invalidFields) {
                  this.settingsErrors[field] = "This field is invalid";
                }
              }
              if (e.notUnique) {
                for (const field of e.notUnique) {
                  if (field === 'newHandle') field = 'handle';
                  this.settingsErrors[field] = `This ${field} is already taken`;
                }
              }
            }
          }
        });
      }
    }
  }
</script>

<style>
  .twitter-account-settings hr {
    margin: 2em 0;
    opacity: 0.5;
  }
</style>
