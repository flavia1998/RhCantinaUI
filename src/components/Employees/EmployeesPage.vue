<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Funcionários</h3>
            <button v-if="user && user?.role === 'Administrador'" @click="goToCreateEmployee"
              class="btn btn-primary">Criar funcionário</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>NIF</th>
                    <th>Nome</th>
                    <th>Departmento</th>
                    <th>Saldo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="employee in employees" :key="employee.nif">
                    <td>{{ employee.nif }}</td>
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.department?.name }}</td>
                    <td>{{ employee.cardBalance.toFixed(2) }}</td>
                    <td>
                      <div class="btn-group" role="group">
                        <button @click="goToViewEmployee(employee.nif)" class="btn btn-primary">Ver</button>
                       <button v-if="user && user?.role === 'Administrador'" @click="goToEditEmployee(employee.nif)" class="btn btn-warning">Editar</button>
                        <!-- <button v-if="user && user?.role === 'Administrador'" @click="confirmDeleteEmployee(employee.nif)"
                          class="btn btn-danger">Remover</button>-->
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
  </div>
</template>

<script>
import { fetchWithAuth } from '@/api';

export default {
  name: 'EmployeesPage',
  props: ['user'],
  data() {
    return {
      employees: [],
      errorMessage: ''
    }
  },
  async created() {
    try {
      const url = this.user && this.user.role === "Administrador"
        ? 'http://localhost:8080/api/employee'
        : `http://localhost:8080/api/employee/department/${this.user.employee.department._id}`;

      const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      this.employees = data;
    } catch (error) {
      this.errorMessage = error.message || 'Erro a listar funcionários.';
    }
  },
  methods: {
    goToCreateEmployee() {
      this.$router.push('/create-employee');
    },
    goToEditEmployee(employeeId) {
      this.$router.push(`/edit-employee/${employeeId}`);
    },
    goToViewEmployee(employeeId) {
      this.$router.push(`/view-employee/${employeeId}`);
    },
    confirmDeleteEmployee(employeeId) {
      if (window.confirm('Are you sure you want to delete this employee?')) {
        this.deleteEmployee(employeeId);
      }
    },
    async deleteEmployee(employeeId) {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/employee/${employeeId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        this.employees = this.employees.filter(employee => employee.nif !== employeeId);
      } catch (error) {
        this.errorMessage = error.message || 'Erro ao eliminar funcionário!';
      }
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 50px;
}
</style>