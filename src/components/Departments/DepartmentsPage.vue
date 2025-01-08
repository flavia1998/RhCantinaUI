<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Departmentos</h3>
            <button @click="goToCreateDepartment" class="btn btn-primary">Criar departmento</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Desconto%</th>
                    <th>Gestor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="department in departments" :key="department._id">
                    <td>{{ department._id }}</td>
                    <td>{{ department.name }}</td>
                    <td>{{ department.discount }}</td>
                    <td>{{ department.departmentManager?.name }}</td>
                    <td>
                      <div class="btn-group" role="group">
                        <button @click="goToViewDepartment(department._id)" class="btn btn-primary">Ver</button>
                        <button @click="goToEditDepartment(department._id)" class="btn btn-warning">Editar</button>
                        <button @click="confirmDeleteDepartment(department._id)" class="btn btn-danger">Remover</button>
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
  name: 'DepartmentsPage',
  data() {
    return {
      departments: [],
      errorMessage: ''
    };
  },
  async created() {
    try {
      const response = await fetchWithAuth('http://localhost:8080/api/department', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      this.departments = data;
    } catch (error) {
      this.errorMessage = error.message || 'Erro a listar departmentos.';
    }
  },
  methods: {
    goToCreateDepartment() {
      this.$router.push('/create-department');
    },
    goToEditDepartment(departmentId) {
      this.$router.push(`/edit-department/${departmentId}`);
    },
    goToViewDepartment(departmentId) {
      this.$router.push(`/view-department/${departmentId}`);
    },
    confirmDeleteDepartment(departmentId) {
      if (window.confirm('Are you sure you want to delete this department?')) {
        this.deleteDepartment(departmentId);
      }
    },
    async deleteDepartment(departmentId) {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/department/${departmentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        this.departments = this.departments.filter(department => department._id !== departmentId);
      } catch (error) {
        this.errorMessage = error.message || 'Erro ao eliminar departamento!';
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