<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3>Employee Details</h3>
            </div>
            <div class="card-body">
              <div v-if="employee">
                <p><strong>ID:</strong> {{ employee._id }}</p>
                <p><strong>Name:</strong> {{ employee.name }}</p>
                <p><strong>NIF:</strong> {{ employee.nif }}</p>
                <p><strong>Card Balance:</strong> {{ employee.cardBalance }}</p>
                <p><strong>Department:</strong> {{ employee.department?.name }}</p>
              </div>
              <div v-else>
                <p>Loading...</p>
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
  
        if (!response.ok) {
          throw new Error('Failed to fetch employee');
        }
  
        const data = await response.json();
        this.employee = data;
      } catch (error) {
        console.error('Error fetching employee:', error);
        this.errorMessage = 'Failed to fetch employee. Please try again later.';
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    margin-top: 50px;
  }
  </style>