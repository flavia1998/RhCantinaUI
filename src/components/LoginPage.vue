<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3>Login</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="form-group mb-3">
                <label for="username">Username</label>
                <input type="text" v-model="username" class="form-control" id="username" required>
              </div>
              <div class="form-group mb-3">
                <label for="password">Password</label>
                <input type="password" v-model="password" class="form-control" id="password" required>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
            <button @click="goToRegister" class="btn btn-link mt-3">Don't have an account? Register</button>
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
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
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
          throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('userToken', data.userToken); // Save the token to localStorage
        this.errorMessage = ''; // Clear any previous error message
        // Handle successful login here (e.g., redirect to another page)
      } catch (error) {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    },
    goToRegister() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 50px;
}
</style>