<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3>Editar departmento</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="editDepartment">
                <div class="form-group mb-3">
                  <label for="name">Nome</label>
                  <input type="text" v-model="name" class="form-control text-uppercase" id="name" required>
                </div>
                <div class="form-group mb-3">
                  <label for="discount">Desconto</label>
                  <input type="number" v-model="discount" class="form-control" id="discount" required>
                </div>
                <div class="form-group mb-3">
                  <label for="departmentManager">Gestor</label>
                  <select v-model="departmentManager" class="form-control" id="departmentManager" required>
                    <option :value="null">---</option>
                    <option v-for="employee in employees" :key="employee._id" :value="employee._id">
                      {{ employee.name }}
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
    async created() {
      const departmentId = this.$route.params.id;
      try {
        // Fetch department details
        const departmentResponse = await fetchWithAuth(`http://localhost:8080/api/department/${departmentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const departmentData = await departmentResponse.json();

        if (!departmentResponse.ok) {
          throw new Error(departmentData.error);
        }
  
        this.name = departmentData.name;
        this.discount = departmentData.discount;
        this.departmentManager = departmentData.departmentManager?._id;
  
        const employeesResponse = await fetchWithAuth('http://localhost:8080/api/employee', {
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
      } catch (error) {
        this.errorMessage = error.message || 'Erro a listar dados!';
      }
    },
    methods: {
      async editDepartment() {
        const departmentId = this.$route.params.id;
        try {
          const response = await fetchWithAuth(`http://localhost:8080/api/department/${departmentId}`, {
            method: 'PUT',
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
  
          this.errorMessage = ''; // Clear any previous error message
          this.$router.push('/departments'); // Redirect to departments page
        } catch (error) {
          this.errorMessage = error.message || 'Erro a atualizar departamento!';
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