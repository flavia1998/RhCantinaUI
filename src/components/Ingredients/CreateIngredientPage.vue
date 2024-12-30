<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card">
            <div class="card-header">
              <h3>Criar ingrediente</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="createIngredient">
                <div class="mb-3">
                  <label for="nome" class="form-label">Nome</label>
                  <input type="text" v-model="ingredient.nome" class="form-control" id="nome" required />
                </div>
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" v-model="ingredient.alergico" id="alergico" />
                  <label class="form-check-label" for="alergico">Alergénico?</label>
                </div>
                <button type="submit" class="btn btn-primary">Criar</button>
                <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
                  {{ errorMessage }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { fetchWithAuth } from '@/api';
  
  export default {
    name: 'CreateIngredientPage',
    data() {
      return {
        ingredient: {
          nome: '',
          alergico: false
        },
        errorMessage: ''
      };
    },
    methods: {
      async createIngredient() {
        try {
          const response = await fetchWithAuth('http://localhost:8081/api/ingredients', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.ingredient)
          });
  
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error);
          }
  
          this.$router.push('/ingredients');
        } catch (error) {
          this.errorMessage = error.message || 'Erro a criar ingrediente';
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