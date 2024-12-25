<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3>Department Details</h3>
          </div>
          <div class="card-body">
            <div v-if="department">
              <p><strong>ID:</strong> {{ department._id }}</p>
              <p><strong>Name:</strong> {{ department.name }}</p>
              <p><strong>Discount:</strong> {{ department.discount }}</p>
              <p><strong>Department Manager:</strong> {{ department.departmentManager?.name }}</p>
              <h4>Employees</h4>
              <ul class="list-group">
                <li v-for="employee in department.employees" :key="employee._id" class="list-group-item">
                  <strong>{{ employee.name }}</strong> ({{ employee.nif }})
                </li>
              </ul>
            </div>
            <div v-else>
              <p>Loading...</p>
            </div>
            <button @click="goBack" class="btn btn-secondary mt-3">Back</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithAuth } from '@/api';

export default {
  name: 'ViewDepartmentPage',
  data() {
    return {
      department: null,
      errorMessage: ''
    };
  },
  async created() {
    const departmentId = this.$route.params.id;
    try {
      const response = await fetchWithAuth(`http://localhost:8080/api/department/${departmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch department');
      }

      const data = await response.json();
      this.department = data;
    } catch (error) {
      console.error('Error fetching department:', error);
      this.errorMessage = 'Failed to fetch department. Please try again later.';
    }
  },
  methods: {
    goBack() {
      this.$router.push('/departments');
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 50px;
}
</style>