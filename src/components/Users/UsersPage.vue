<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Utilizadores</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Nome de utilizador</th>
                    <th>NIF</th>
                    <th>Função</th>
                    <th>Estado</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.username">
                    <td>{{ user.username }}</td>
                    <td>{{ user.nif }}</td>
                    <td>{{ user.role }}</td>
                    <td>{{ user.is_active ? 'Ativo' : 'Inativo' }}</td>
                    <td>
                      <div class="btn-group" role="group">
                        <button @click="goToEditUser(user.username)" class="btn btn-warning">Editar</button>
                        <button v-if="!user.is_active" @click="openActivateModal(user)" class="btn btn-success">Ativar</button>
                        <button v-if="user.is_active" @click="confirmDeactivateUser(user)" class="btn btn-danger">Desativar</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for activating user -->
    <div class="modal fade" id="activateUserModal" tabindex="-1" aria-labelledby="activateUserModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="activateUserModalLabel">Ativar utilizador</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div>
              <label for="employee">Selecionar funcionário</label>
              <select v-model="selectedEmployeeNif" id="employee" class="form-select">
                <option v-for="employee in employees" :key="employee.nif" :value="employee.nif">
                  {{ employee.name }} ({{ employee.nif }})
                </option>
              </select>
            </div>
            <div class="mt-3">
              <button @click="handleCreateEmployee" class="btn btn-secondary">Não tem um funcionário associado? Crie um primeiro</button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="activateUser">Ativar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from '@/api';
import * as bootstrap from 'bootstrap';

export default {
  name: 'UsersPage',
  data() {
    return {
      users: [],
      employees: [],
      selectedUser: null,
      selectedEmployeeNif: null,
      errorMessage: ''
    };
  },
  async created() {
    try {
      const response = await fetchWithAuth('http://localhost:8080/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      this.users = data;
      this.errorMessage = '';
    } catch (error) {
      console.error('Error fetching users:', error);
      this.errorMessage = 'Failed to fetch users. Please try again later.';
    }

    try {
      const response = await fetchWithAuth('http://localhost:8080/api/employee', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }

      const data = await response.json();
      this.employees = data;
      this.errorMessage = '';
    } catch (error) {
      console.error('Error fetching employees:', error);
      this.errorMessage = 'Failed to fetch employees. Please try again later.';
    }
  },
  props: ['user'],
  methods: {
    confirmDeactivateUser(user) {
      if (window.confirm('Tem a certeza de que pretende desativar este utilizador?')) {
        this.deactivateUser(user);
      }
    },
    async deactivateUser(user) {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/user/${user.username}/deactivate`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }

        user.is_active = false;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = error.message || 'Erro a desativar utilizador.';
      }
    },
    handleCreateEmployee() {
      const modal = bootstrap.Modal.getInstance(document.getElementById('activateUserModal'));
      modal.hide();
      this.$router.push('/create-employee');
    },
    openActivateModal(user) {
      this.selectedUser = user;
      this.selectedEmployeeNif = user.nif || null;
      const modal = new bootstrap.Modal(document.getElementById('activateUserModal'));
      modal.show();
    },
    goToEditUser(username) {
      this.$router.push(`/edit-user/${username}`);
    },
    async activateUser() {
      if (!this.selectedEmployeeNif) {
        this.errorMessage = 'Por favor selecione um funcionário.';
        return;
      }

      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/user/${this.selectedUser.username}/activate`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nif: this.selectedEmployeeNif })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        this.selectedUser.is_active = true;
        this.selectedUser.nif = this.selectedEmployeeNif;

        const modal = bootstrap.Modal.getInstance(document.getElementById('activateUserModal'));
        modal.hide();
        this.errorMessage = '';
      } catch (error) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('activateUserModal'));
        modal.hide();
        this.errorMessage = error.message || 'Erro a ativar utilizador.';
      }
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 50px;
}
</style>