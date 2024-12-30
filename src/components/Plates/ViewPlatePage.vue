<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow-sm">
            <div class="card-header">
              <h3>Detalhes do prato</h3>
            </div>
            <div class="card-body">
              <div v-if="plate">
                <h4>{{ plate.name }}</h4>
                <p><strong>Tipo:</strong> {{ plate.type }}</p>
                <p><strong>Preço:</strong> {{ plate.price }}</p>
                <div>
                  <strong>Ingredientes:</strong>
                  <ul>
                    <li v-for="ingredient in plate.ingredients" :key="ingredient._id">
                      {{ ingredient.nome }} <span v-if="ingredient.alergico">(Alergénico)</span>
                    </li>
                  </ul>
                </div>
              </div>
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
    name: 'ViewPlatePage',
    data() {
      return {
        plate: null,
        errorMessage: ''
      };
    },
    async created() {
      const plateId = this.$route.params.plateId;
      await this.fetchPlate(plateId);
    },
    methods: {
      async fetchPlate(plateId) {
        try {
          const response = await fetchWithAuth(`http://localhost:8081/api/plates/${plateId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error);
          }
  
          this.plate = data;
        } catch (error) {
          this.errorMessage = error.message || 'Erro a obter detalhes do prato';
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