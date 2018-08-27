<template>
  <div>
    <h1>Login</h1>
    <el-form
      ref="loginForm"
      :model="login"
      :rules="loginRules"
      label-width="150px">
      <el-form-item label="Username (handle)" prop="handle">
        <el-input v-model="login.handle"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="login.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="performLogin()">Login</el-button>
      </el-form-item>
    </el-form>

    <h1>Register</h1>
    <el-form
      ref="registerForm"
      :model="register"
      :rules="registerRules"
      label-width="150px">
      <el-form-item label="Full name" prop="name" :error="registerErrors.name">
        <el-input v-model="register.name"></el-input>
      </el-form-item>
      <el-form-item label="Username (handle)" prop="handle" :error="registerErrors.handle">
        <el-input v-model="register.handle"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email" :error="registerErrors.email">
        <el-input v-model="register.email"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password" :error="registerErrors.password">
        <el-input type="password" v-model="register.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="performRegister()">Register</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import API from '../api.js';

  import { Notification } from 'element-ui';

  export default {
    data () {
      return {
        login: {
          handle: '',
          passowrd: ''
        },
        loginRules: {
          handle: {
            required: true, message: 'Please input your username', trigger: 'change'
          },
          password: {
            required: true, message: 'Please input your password', trigger: 'change'
          }
        },

        register: {
          name: '',
          handle: '',
          email: '',
          password: ''
        },
        registerRules: {
          name: {
            required: true, message: 'Please input your name', trigger: 'change'
          },
          handle: {
            required: true, message: 'Please input your desired username', trigger: 'change'
          },
          email: {
            required: true, message: 'Please input your email', trigger: 'change'
          },
          password: {
            required: true, message: 'Please input your password', trigger: 'change'
          }
        },
        registerErrors: {
          name: '',
          handle: '',
          email: '',
          password: ''
        }
      }
    },
    methods: {
      performLogin () {
        this.$refs.loginForm.validate(async valid => {
          if (valid) {
            try {
              const { status } = await API.post('/account/login', this.login);
              if (status === 'ok') {
                // TODO: Goto home
              }
            } catch (e) {}
          }
        });
      },
      performRegister () {
        Object.keys(this.registerErrors).forEach(k => this.registerErrors[k] = '');
        this.$refs.registerForm.validate(async valid => {
          if (valid) {
            try {
              const resp = await API.post('/account/register', this.register);
              console.log(resp);

              if (resp.status === 'ok') {
                Notification({
                  title: 'Success!',
                  message: 'You\'re now registered. Please log in'
                });
              }
            } catch (e) {
              if (e.missingFields) {
                for (const field of e.missingFields) {
                  this.registerErrors[field] = "Please enter this field";
                }
              }
              if (e.notUnique) {
                for (const field of e.notUnique) {
                  this.registerErrors[field] = `This ${field} is already taken`;
                }
              }
            }
          }
        });
      }
    }
  }
</script>
