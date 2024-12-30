<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3>Editar tarefa</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="editTask">
                <div class="form-group mb-3">
                  <label for="description">Descrição
                  </label>
                  <input type="text" v-model="description" class="form-control" id="description" required>
                </div>
                <div class="form-group mb-3">
                  <label for="deadline">Data limite</label>
                  <input type="date" v-model="deadline" class="form-control text-uppercase" id="deadline" required>
                </div>
                <div class="form-group mb-3">
                  <label for="employee">Funcionário</label>
                  <select v-model="employee" class="form-control" id="employee" required>
                    <option v-for="emp in employees" :key="emp.nif" :value="emp.nif">
                      {{ emp.name }}
                    </option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </form>
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
    name: 'EditTaskPage',
    props: ['user'],
    data() {
      return {
        description: '',
        deadline: '',
        finished: false,
        employee: '',
        employees: [],
        errorMessage: ''
      }
    },
    async created() {
      const taskId = this.$route.params.id;
      try {
        const url = this.user.role === "Administrador" 
        ? 'http://localhost:8080/api/employee' 
        : `http://localhost:8080/api/employee/department/${this.user.employee.department._id}`;
        
        const employeesResponse = await fetchWithAuth(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const employeesData = await employeesResponse.json();
        if (!employeesResponse.ok) {
          throw new Error(employeesData.error);
        }
  
        this.employees = employeesData;
  
        const taskResponse = await fetchWithAuth(`http://localhost:8080/api/tasks/${taskId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const taskData = await taskResponse.json();
        if (!taskResponse.ok) {
          throw new Error(taskData.error);
        }
  
        this.description = taskData.description;
        this.deadline = taskData.deadline.split('T')[0];
        this.finished = taskData.finished;
        this.employee = taskData.employee.nif;
      } catch (error) {
        this.errorMessage = error.message || 'Erro a listar funcionários.';
      }
    },
    methods: {
      async editTask() {
        const taskId = this.$route.params.id;
        try {
          const response = await fetchWithAuth(`http://localhost:8080/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              description: this.description,
              deadline: this.deadline,
              finished: this.finished,
              employee: this.employee
            })
          });
  
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error);
          }
  
          this.errorMessage = '';
          this.$router.push('/tasks');
        } catch (error) {
          this.errorMessage = error.message || 'Erro ao editar tarefa.';
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