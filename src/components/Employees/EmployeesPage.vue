<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Employees</h3>
            <button @click="goToCreateEmployee" class="btn btn-primary">Create Employee</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>NIF</th>
                    <th>Name</th>
                    <th>Card Balance</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="employee in employees" :key="employee.nif">
                    <td>{{ employee.nif }}</td>
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.cardBalance }}</td>
                    <td>{{ employee.role }}</td>
                    <td>{{ employee.department?.name }}</td>
                    <td>
                      <div class="btn-group" role="group">
                        <button @click="goToEditEmployee(employee.nif)" class="btn btn-warning btn-sm">Edit</button>
                        <button @click="confirmDeleteEmployee(employee.nif)"
                          class="btn btn-danger btn-sm">Delete</button>
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
  name: 'EmployeesPage',
  data() {
    return {
      employees: [],
      errorMessage: ''
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
    goToCreateEmployee() {
      this.$router.push('/create-employee');
    },
    goToEditEmployee(employeeId) {
      this.$router.push(`/edit-employee/${employeeId}`);
    },
    confirmDeleteEmployee(employeeId) {
      if (window.confirm('Are you sure you want to delete this employee?')) {
        this.deleteEmployee(employeeId);
      }
    },
    async deleteEmployee(employeeId) {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/employee/${employeeId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete employee');
        }

        // Remove the deleted employee from the list
        this.employees = this.employees.filter(employee => employee.nif !== employeeId);
      } catch (error) {
        console.error('Error deleting employee:', error);
        this.errorMessage = 'Failed to delete employee. Please try again later.';
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