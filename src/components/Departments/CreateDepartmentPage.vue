<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3>Create Department</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="createDepartment">
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
                <select v-model="departmentManager" class="form-control" id="departmentManager">
                  <option value="">Select a manager</option>
                  <option v-for="employee in filteredEmployees" :key="employee._id" :value="employee._id">
                    {{ employee.name }}
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
import { fetchWithAuth } from '@/api';

export default {
  name: 'CreateDepartmentPage',
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
      return this.employees;
    }
  },
  async created() {
    try {
      const response = await fetchWithAuth('http://localhost:8080/api/employee', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
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
    async createDepartment() {
      try {
        const response = await fetchWithAuth('http://localhost:8080/api/department', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.name,
            discount: this.discount,
            departmentManager: this.departmentManager || null
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create department');
        }

        const data = await response.json();
        console.log('Department created successfully:', data);
        this.errorMessage = ''; // Clear any previous error message
        this.$router.push('/departments'); // Redirect to departments page
      } catch (error) {
        console.error('Error creating department:', error);
        this.errorMessage = 'Failed to create department. Please try again later.';
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