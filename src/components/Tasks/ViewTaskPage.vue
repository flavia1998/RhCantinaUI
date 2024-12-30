<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow-sm">
            <div class="card-header">
              <h3>Detalhes da tarefa</h3>
            </div>
            <div class="card-body">
              <div v-if="task">
                <p><strong>Descrição:</strong> {{ task.description }}</p>
                <p><strong>Data limite:</strong> {{ task.deadline }}</p>
                <p><strong>Terminada:</strong> {{ task.finished ? 'Yes' : 'No' }}</p>
                <p><strong>Atribuída:</strong> {{ task.employee.name }}</p>
              </div>
              <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
                {{ errorMessage }}
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
    name: 'ViewTaskPage',
    data() {
      return {
        task: null,
        errorMessage: ''
      };
    },
    async created() {
      const taskId = this.$route.params.taskId;
      await this.fetchTask(taskId);
    },
    methods: {
      async fetchTask(taskId) {
        try {
          const response = await fetchWithAuth(`http://localhost:8080/api/tasks/${taskId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error);
          }
  
          this.task = data;
        } catch (error) {
          this.errorMessage = error.message || 'Erro a carregar tarefa.';
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