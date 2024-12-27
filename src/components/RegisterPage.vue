<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3>Register</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="register">
                <div class="form-group mb-3">
                  <label for="username">Username</label>
                  <input type="text" v-model="username" class="form-control" id="username" required>
                </div>
                <div class="form-group mb-3">
                  <label for="password">Password</label>
                  <input type="password" v-model="password" class="form-control" id="password" required>
                </div>
                <div class="form-group mb-3">
                  <label for="confirmPassword">Confirm Password</label>
                  <input type="password" v-model="confirmPassword" class="form-control" id="confirmPassword" required>
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
              </form>
              <button @click="goToLogin" class="btn btn-link mt-3">Already have an account? Login</button>
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
  
          if (!response.ok) {
            throw new Error('Registration failed');
          }
  
          await response.json();
          // Handle successful registration here (e.g., redirect to login page)
          this.errorMessage = ''; // Clear any previous error message
          this.$router.push('/login');
        } catch (error) {
          console.error('Registration failed:', error);
          this.errorMessage = 'Registration failed. Please check your details and try again.';
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