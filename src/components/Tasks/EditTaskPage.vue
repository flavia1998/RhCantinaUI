<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3>Edit Task</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="editTask">
                <div class="form-group mb-3">
                  <label for="description">Description</label>
                  <input type="text" v-model="description" class="form-control" id="description" required>
                </div>
                <div class="form-group mb-3">
                  <label for="deadline">Deadline</label>
                  <input type="date" v-model="deadline" class="form-control text-uppercase" id="deadline" required>
                </div>
                <div class="form-group mb-3">
                  <label for="employee">Employee</label>
                  <select v-model="employee" class="form-control" id="employee" required>
                    <option v-for="emp in employees" :key="emp.nif" :value="emp.nif">
                      {{ emp.name }}
                    </option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">Save</button>
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
        // Fetch employees
        const employeesResponse = await fetchWithAuth('http://localhost:8080/api/employee', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!employeesResponse.ok) {
          throw new Error('Failed to fetch employees');
        }
  
        const employeesData = await employeesResponse.json();
        this.employees = employeesData;
  
        // Fetch task details
        const taskResponse = await fetchWithAuth(`http://localhost:8080/api/tasks/${taskId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!taskResponse.ok) {
          throw new Error('Failed to fetch task');
        }
  
        const taskData = await taskResponse.json();
        this.description = taskData.description;
        this.deadline = taskData.deadline.split('T')[0]; // Format date for input
        this.finished = taskData.finished;
        this.employee = taskData.employee.nif;
      } catch (error) {
        console.error('Error fetching data:', error);
        this.errorMessage = 'Failed to fetch data. Please try again later.';
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
            throw new Error('Failed to update task');
          }
  
          const data = await response.json();
          console.log('Task updated successfully:', data);
          this.errorMessage = ''; // Clear any previous error message
          this.$router.push('/tasks'); // Redirect to tasks page
        } catch (error) {
          console.error('Error updating task:', error);
          this.errorMessage = 'Failed to update task. Please try again later.';
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