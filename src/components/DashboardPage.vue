<template>
  <div class="container-fluid mt-5">
    <div class="row">
      <div class="col-md-12 mb-3">
        <div class="alert alert-primary alert-dismissible fade show" role="alert">
          Welcome, <strong>{{ user?.username }}</strong> to the dashboard!
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0">Profile</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <p class="card-text"><strong>Username:</strong> {{ user?.username }}</p>
              <p class="card-text" v-if="user?.nif"><strong>Nif:</strong> {{ user?.nif }}</p>
              <p class="card-text"><strong>Role:</strong> {{ user?.role }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3" v-if="user?.employee">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0">Employee info</h5>
          </div>
          <div class="card-body">
            <p class="card-text"><strong>Name:</strong> {{ user.employee.name }}</p>
            <p class="card-text" v-if="user.employee.department"><strong>Department:</strong> {{
              user.employee.department.name }}</p>
            <p class="card-text" v-if="user?.role === 'Funcionario' && user.employee.department?.departmentManager"><strong>Manager:</strong> {{
              user.employee.department.departmentManager.name }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3" v-if="user?.employee">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0">Balance</h5>
          </div>
          <div class="card-body">
            <p class="card-text"><strong>Card Balance:</strong> {{ user.employee.cardBalance }}</p>
            <button class="btn btn-primary mt-3" @click="addBalance">Add Balance</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 mb-3" v-for="link in filteredLinks" :key="link.path">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ link.title }}</h5>
            <p class="card-text">{{ link.description }}</p>
            <router-link :to="link.path" class="btn btn-primary">{{ link.buttonText }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from '@/api';

export default {
  name: 'DashboardPage',
  props: ['user'],
  data() {
    return {
      links: [
        {
          title: 'Departments',
          description: 'View and manage departments',
          path: '/departments',
          buttonText: 'Go to Departments',
          roles: ['Administrador']
        },
        {
          title: 'Employees',
          description: 'View and manage employees',
          path: '/employees',
          buttonText: 'Go to Employees',
          roles: ['Administrador', 'Gestor']
        },
        {
          title: 'Tasks',
          description: 'View and manage tasks',
          path: '/tasks',
          buttonText: 'Go to Tasks',
          roles: ['Administrador', 'Gestor', 'Funcionário']
        },
        {
          title: 'Users',
          description: 'View and manage users',
          path: '/users',
          buttonText: 'Go to Users',
          roles: ['Administrador']
        }
      ],
      errorMessage: ''
    };
  },
  computed: {
    filteredLinks() {
      return this.links.filter(link => link.roles.includes(this.user?.role));
    }
  },
  methods: {
    async addBalance() {
      const amount = prompt("Enter the amount to add to the balance:");
      if (amount === null) {
        return;
      }
      if (!isNaN(amount) && amount > 0) {
        try {
          const response = await fetchWithAuth(`http://localhost:8080/api/employee/${this.user.employee.nif}/addBalance`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: parseFloat(amount) })
          });

          if (!response.ok) {
            throw new Error('Failed to add balance');
          }

          const data = await response.json();
          this.$emit('update-card-balance', data.cardBalance); // Emit the event with the new balance
        } catch (error) {
          console.error('Error adding balance:', error);
          this.errorMessage = 'Failed to add balance. Please try again later.';
        }
      } else {
        alert("Invalid amount entered. Please enter a valid number greater than 0.");
      }
    }
  }
};
</script>

<style scoped>
.container-fluid {
  margin-top: 50px;
}

.card {
  border-radius: 10px;
}

.card-header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.card-body {
  padding: 20px;
}

.card-text {
  margin-bottom: 10px;
}
</style>