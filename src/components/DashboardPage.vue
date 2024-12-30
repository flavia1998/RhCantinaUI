<template>
  <div class="container-fluid mt-5">
    <div class="row">
      <div class="col-md-12 mb-3">
        <div class="alert alert-primary alert-dismissible fade show" role="alert">
          Bem vindo, <strong>{{ user?.username }}</strong> à plataforma!
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0">Perfil</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <p class="card-text"><strong>Nome de utilizador:</strong> {{ user?.username }}</p>
              <p class="card-text" v-if="user?.nif"><strong>NIF:</strong> {{ user?.nif }}</p>
              <p class="card-text"><strong>Função:</strong> {{ user?.role }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3" v-if="user?.employee">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0">Informação do funcionário</h5>
          </div>
          <div class="card-body">
            <p class="card-text"><strong>Nome:</strong> {{ user.employee.name }}</p>
            <p class="card-text" v-if="user.employee.department"><strong>Departmento:</strong> {{
              user.employee.department.name }}</p>
            <p class="card-text" v-if="user?.role === 'Funcionario' && user.employee.department?.departmentManager"><strong>Gestor:</strong> {{
              user.employee.department.departmentManager.name }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3" v-if="user?.employee">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0">Cartão</h5>
          </div>
          <div class="card-body">
            <p class="card-text"><strong>Saldo:</strong> {{ user.employee.cardBalance }}</p>
            <button class="btn btn-primary mt-3" @click="addBalance">Adicionar saldo</button>
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
          title: 'Departamentos',
          description: 'Ver e gerir departamentos',
          path: '/departments',
          buttonText: 'Ir para Departamentos',
          roles: ['Administrador']
        },
        {
          title: 'Funcionários',
          description: 'Ver e gerir funcionários',
          path: '/employees',
          buttonText: 'Ir para Funcionários',
          roles: ['Administrador', 'Gestor']
        },
        {
          title: 'Tarefas',
          description: 'Ver e gerir tarefas',
          path: '/tasks',
          buttonText: 'Ir para Tarefas',
          roles: ['Administrador', 'Gestor', 'Funcionario']
        },
        {
          title: 'Utilizadores',
          description: 'Ver e gerir utilizadores',
          path: '/users',
          buttonText: 'Ir para Utilizadores',
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
      const amount = prompt("Insira o montante de saldo a adicionar:");
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

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error);
          }

          this.$emit('update-card-balance', data.newBalance);
        } catch (error) {
          this.errorMessage = error.message || 'Erro a adicionar saldo.';
        }
      } else {
        alert("Valor inválido introduzido. Introduza um número válido superior a 0.");
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