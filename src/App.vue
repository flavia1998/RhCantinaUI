<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">MyApp</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/departments">Departments</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/employees">Employees</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tasks">Tasks</router-link>
            </li>
          </ul>
          <div v-if="user" class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              {{ user.username }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      user: null
    }
  },
  created() {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      this.$router.push('/login');
    } else {
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user);
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      this.user = null;
      this.$router.push('/login');
    }
  }
}
</script>

<style>
.text-uppercase {
  text-transform: uppercase;
}
</style>