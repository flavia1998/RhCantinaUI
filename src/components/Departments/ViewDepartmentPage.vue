<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3>Detalhes do departmento</h3>
          </div>
          <div class="card-body">
            <div v-if="department">
              <p><strong>ID:</strong> {{ department._id }}</p>
              <p><strong>Nome:</strong> {{ department.name }}</p>
              <p><strong>Desconto:</strong> {{ department.discount }}</p>
              <p><strong>Gestor:</strong> {{ department.departmentManager?.name }}</p>
              <h4>Funcionários</h4>
              <ul class="list-group">
                <li v-for="employee in department.employees" :key="employee._id" class="list-group-item">
                  <strong>{{ employee.name }}</strong> ({{ employee.nif }})
                </li>
              </ul>
            </div>
            <div v-else>
              <p>A carregar...</p>
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
  name: 'ViewDepartmentPage',
  data() {
    return {
      department: null,
      errorMessage: ''
    };
  },
  async created() {
    const departmentId = this.$route.params.id;
    try {
      const response = await fetchWithAuth(`http://localhost:8080/api/department/${departmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      this.department = data;
    } catch (error) {
      this.errorMessage = error.message || 'Erro ao listar departamento!';
    }
  },
  methods: {
    goBack() {
      this.$router.push('/departments');
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 50px;
}
</style>