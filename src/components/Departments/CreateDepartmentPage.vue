<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3>Criar departamento</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="createDepartment">
              <div class="form-group mb-3">
                <label for="name">Nome</label>
                <input type="text" v-model="name" class="form-control text-uppercase" id="name" required>
              </div>
              <div class="form-group mb-3">
                <label for="discount">Desconto</label>
                <input type="number" v-model="discount" class="form-control" id="discount" required>
              </div>
              <button type="submit" class="btn btn-primary">Criar</button>
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
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        this.errorMessage = '';
        this.$router.push('/departments');
      } catch (error) {
        this.errorMessage = error.message || 'Erro ao criar departamento.';
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