<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Departments</h3>
            <button @click="goToCreateDepartment" class="btn btn-primary">Create Department</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Discount</th>
                    <th>Department Manager</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="department in departments" :key="department._id">
                    <td>{{ department._id }}</td>
                    <td>{{ department.name }}</td>
                    <td>{{ department.discount }}</td>
                    <td>{{ department.departmentManager?.name }}</td>
                    <td>
                      <div class="btn-group" role="group">
                        <button @click="goToViewDepartment(department._id)" class="btn btn-info">View</button>
                        <button @click="goToEditDepartment(department._id)" class="btn btn-warning">Edit</button>
                        <button @click="confirmDeleteDepartment(department._id)" class="btn btn-danger">Delete</button>
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
  name: 'DepartmentsPage',
  data() {
    return {
      departments: [],
      errorMessage: ''
    };
  },
  async created() {
    try {
      const response = await fetchWithAuth('http://localhost:8080/api/department', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }

      const data = await response.json();
      this.departments = data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      this.errorMessage = 'Failed to fetch departments. Please try again later.';
    }
  },
  methods: {
    goToCreateDepartment() {
      this.$router.push('/create-department');
    },
    goToEditDepartment(departmentId) {
      this.$router.push(`/edit-department/${departmentId}`);
    },
    goToViewDepartment(departmentId) {
      this.$router.push(`/view-department/${departmentId}`);
    },
    confirmDeleteDepartment(departmentId) {
      if (window.confirm('Are you sure you want to delete this department?')) {
        this.deleteDepartment(departmentId);
      }
    },
    async deleteDepartment(departmentId) {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/department/${departmentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete department');
        }

        this.departments = this.departments.filter(department => department._id !== departmentId);
      } catch (error) {
        console.error('Error deleting department:', error);
        this.errorMessage = 'Failed to delete department. Please try again later.';
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