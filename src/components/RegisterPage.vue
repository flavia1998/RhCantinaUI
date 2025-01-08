<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3>Registo</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="register">
                <div class="form-group mb-3">
                  <label for="username">Nome de utilizador</label>
                  <input type="text" v-model="username" class="form-control" id="username" required>
                </div>
                <div class="form-group mb-3">
                  <label for="password">Password</label>
                  <input type="password" v-model="password" class="form-control" id="password" required>
                </div>
                <div class="form-group mb-3">
                  <label for="confirmPassword">Confirmar Password</label>
                  <input type="password" v-model="confirmPassword" class="form-control" id="confirmPassword" required>
                </div>
                <button type="submit" class="btn btn-primary">Registo</button>
              </form>
              <button @click="goToLogin" class="btn btn-link mt-3">Já tem conta? Login</button>
              <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RegisterPage',
    data() {
      return {
        username: '',
        password: '',
        confirmPassword: '',
        errorMessage: ''
      }
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          this.errorMessage = 'Passwords do not match';
          return;
        }
  
        try {
          const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password
            })
          });
  
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error);
          }
  
          this.errorMessage = '';
          this.$router.push('/login');
        } catch (error) {
          this.errorMessage = error.message || 'Erro a registar utilizador.';
        }
      },
      goToLogin() {
        this.$router.push('/');
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    margin-top: 50px;
  }
  </style>