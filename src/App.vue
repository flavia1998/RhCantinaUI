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
          <ul class="navbar-nav me-auto" v-if="user?.username">
            <li class="nav-item" v-for="link in filteredNavLinks" :key="link.path">
              <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
            </li>
          </ul>
          <div v-if="user?.username" class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown"
              aria-expanded="false">
              <b>{{ user.username }}</b> <span>{{ user.role }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li v-if="user && user.nif"><a class="dropdown-item" href="#" @click="goToEmployeeDetails">Employee details</a></li>
              <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <router-view :user="user" @user-logged-in="handleUserLoggedIn"></router-view>
  </div>
</template>

<script>
import { getEmployeeByNif } from './api';

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || null,
      navLinks: [
        { name: 'Home', path: '/', roles: ['Administrador', 'Gestor', 'Funcionario'] },
        { name: 'Departments', path: '/departments', roles: ['Administrador'] },
        { name: 'Employees', path: '/employees', roles: ['Administrador', 'Gestor'] },
        { name: 'Tasks', path: '/tasks', roles: ['Administrador', 'Gestor', 'Funcionario'] },
        { name: 'Users', path: '/users', roles: ['Administrador'] }
      ]
    };
  },
  computed: {
    filteredNavLinks() {
      return this.navLinks.filter(link => link.roles.includes(this.user.role));
    }
  },
  methods: {
    async handleUserLoggedIn(user) {
      this.user = user;
      if (user.nif){
        let employee = await getEmployeeByNif(user.nif);
        this.user.employee = employee;
      }

      localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
    goToEmployeeDetails() {
      this.$router.push(`/view-employee/${this.user.nif}`);
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 50px;
}
</style>