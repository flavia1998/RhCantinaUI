<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="">MyApp</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto" v-if="user">
            <li class="nav-item" v-for="link in navLinks" :key="link.path">
              <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
            </li>
          </ul>
          <div v-if="user" class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown"
              aria-expanded="false">
              <b>{{ user.username }}</b> <span>{{ user.role }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <router-view @user-logged-in="handleUserLoggedIn"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      user: null,
      navLinks: [
        { name: 'Home', path: '/' },
        { name: 'Departments', path: '/departments' },
        { name: 'Employees', path: '/employees' },
        { name: 'Tasks', path: '/tasks' }
      ]
    }
  },
  created() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
  },
  methods: {
    handleUserLoggedIn(user) {
      this.user = user;
    },
    logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
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