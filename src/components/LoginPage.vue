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
                <label for="username">Nome de utilizador</label>
                <input type="text" v-model="username" class="form-control" id="username" required>
              </div>
              <div class="form-group mb-3">
                <label for="password">Password</label>
                <input type="password" v-model="password" class="form-control" id="password" required>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
            <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
              {{ errorMessage }}
            </div>
            <div class="mt-3">
              <p>Não tem conta? <a href="#" @click="goToRegister">Registo</a></p>
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
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        this.errorMessage = '';
        this.$emit('user-logged-in', user);
        this.$router.push('/');
      } catch (error) {
        this.errorMessage = error.message || 'Login falhou. Tente novamente.';
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