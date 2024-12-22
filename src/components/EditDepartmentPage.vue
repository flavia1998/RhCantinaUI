<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3>Edit Department</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="editDepartment">
                <div class="form-group mb-3">
                  <label for="name">Name</label>
                  <input type="text" v-model="name" class="form-control text-uppercase" id="name" required>
                </div>
                <div class="form-group mb-3">
                  <label for="discount">Discount</label>
                  <input type="number" v-model="discount" class="form-control" id="discount" required>
                </div>
                <div class="form-group mb-3">
                  <label for="departmentManager">Department Manager</label>
                  <select v-model="departmentManager" class="form-control" id="departmentManager" required>
                    <option v-for="employee in filteredEmployees" :key="employee._id" :value="employee._id">
                      {{ employee.name }}
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
  export default {
    name: 'EditDepartmentPage',
    data() {
      return {
        name: '',
        discount: '',
        departmentManager: '',
        employees: [],
        errorMessage: ''
      }
    },
    computed: {
      filteredEmployees() {
        return this.employees.filter(employee => employee.role === 'Gestor');
      }
    },
    async created() {
      const departmentId = this.$route.params.id;
      try {
        // Fetch department details
        const departmentResponse = await fetch(`http://localhost:8080/api/department/${departmentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        });
  
        if (!departmentResponse.ok) {
          throw new Error('Failed to fetch department');
        }
  
        const departmentData = await departmentResponse.json();
        this.name = departmentData.name;
        this.discount = departmentData.discount;
        this.departmentManager = departmentData.departmentManager;
  
        // Fetch employees
        const employeesResponse = await fetch('http://localhost:8080/api/employee', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        });
  
        if (!employeesResponse.ok) {
          throw new Error('Failed to fetch employees');
        }
  
        const employeesData = await employeesResponse.json();
        this.employees = employeesData;
      } catch (error) {
        console.error('Error fetching data:', error);
        this.errorMessage = 'Failed to fetch data. Please try again later.';
      }
    },
    methods: {
      async editDepartment() {
        const departmentId = this.$route.params.id;
        try {
          const response = await fetch(`http://localhost:8080/api/department/${departmentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify({
              name: this.name,
              discount: this.discount,
              departmentManager: this.departmentManager || null
            })
          });
  
          if (!response.ok) {
            throw new Error('Failed to update department');
          }
  
          const data = await response.json();
          console.log('Department updated successfully:', data);
          this.errorMessage = ''; // Clear any previous error message
          this.$router.push('/departments'); // Redirect to departments page
        } catch (error) {
          console.error('Error updating department:', error);
          this.errorMessage = 'Failed to update department. Please try again later.';
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    margin-top: 50px;
  }
  .text-uppercase {
    text-transform: uppercase;
  }
  </style>