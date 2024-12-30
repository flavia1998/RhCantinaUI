<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3>Detalhes do funcionário</h3>
            </div>
            <div class="card-body">
              <div v-if="employee">
                <p><strong>ID:</strong> {{ employee._id }}</p>
                <p><strong>Nome:</strong> {{ employee.name }}</p>
                <p><strong>NIF:</strong> {{ employee.nif }}</p>
                <p><strong>Saldo:</strong> {{ employee.cardBalance }}</p>
                <p><strong>Departmento:</strong> {{ employee.department?.name }}</p>
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
    name: 'ViewEmployeePage',
    props: ['user'],
    data() {
      return {
        employee: null,
        errorMessage: ''
      };
    },
    async created() {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/employee/${this.$route.params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
  
        this.employee = data;
      } catch (error) {
        this.errorMessage = error.message || 'Erro a carregar funcionário';
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    margin-top: 50px;
  }
  </style>