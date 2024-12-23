<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3>Create Task</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="createTask">
                <div class="form-group mb-3">
                  <label for="description">Description</label>
                  <input type="text" v-model="description" class="form-control text-uppercase" id="description" required>
                </div>
                <div class="form-group mb-3">
                  <label for="deadline">Deadline</label>
                  <input type="date" v-model="deadline" class="form-control" id="deadline" required>
                </div>
                <div class="form-group mb-3">
                  <label for="employee">Employee</label>
                  <select v-model="employee" class="form-control" id="employee" required>
                    <option v-for="emp in employees" :key="emp.nif" :value="emp.nif">
                      {{ emp.name }}
                    </option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">Create</button>
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
  export default {
    name: 'CreateTaskPage',
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
      try {
        const response = await fetch('http://localhost:8080/api/employee', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
  
        const data = await response.json();
        this.employees = data;
      } catch (error) {
        console.error('Error fetching employees:', error);
        this.errorMessage = 'Failed to fetch employees. Please try again later.';
      }
    },
    methods: {
      async createTask() {
        try {
          const response = await fetch('http://localhost:8080/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify({
              description: this.description,
              deadline: this.deadline,
              finished: this.finished,
              employee: this.employee
            })
          });
  
          if (!response.ok) {
            throw new Error('Failed to create task');
          }
  
          const data = await response.json();
          console.log('Task created successfully:', data);
          this.errorMessage = ''; // Clear any previous error message
          this.$router.push('/tasks'); // Redirect to tasks page
        } catch (error) {
          console.error('Error creating task:', error);
          this.errorMessage = 'Failed to create task. Please try again later.';
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