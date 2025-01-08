<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow-sm">
            <div class="card-header">
              <h3>Criar prato</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="createPlate">
                <div class="mb-3">
                  <label for="name" class="form-label">Nome</label>
                  <input type="text" v-model="plate.name" class="form-control" id="name" required />
                </div>
                <div class="mb-3">
                  <label for="type" class="form-label">Tipo</label>
                  <input type="text" v-model="plate.type" class="form-control" id="type" required />
                </div>
                <div class="mb-3">
                  <label for="price" class="form-label">Preço</label>
                  <input type="number" v-model="plate.price" class="form-control" id="price" required />
                </div>
                <div class="mb-3">
                  <label for="ingredients" class="form-label">Ingredientes</label>
                  <select v-model="selectedIngredient" class="form-select mb-2" @change="addIngredient">
                    <option value="" disabled selected>Selecione um ingrediente</option>
                    <option v-for="ingredient in ingredients" :key="ingredient._id" :value="ingredient">
                      {{ ingredient.nome }} <span v-if="ingredient.alergico">(Alergénico)</span>
                    </option>
                  </select>
                  <ul class="list-group">
                    <li v-for="(ingredient, index) in plate.ingredients" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
                      {{ ingredient.nome }} <span v-if="ingredient.alergico">(Alergénico)</span>
                      <button type="button" class="btn btn-danger btn-sm" @click="removeIngredient(index)">Remover</button>
                    </li>
                  </ul>
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
    name: 'CreatePlatePage',
    data() {
      return {
        plate: {
          name: '',
          type: '',
          ingredients: [],
          price: 0
        },
        ingredients: [],
        selectedIngredient: null,
        errorMessage: ''
      };
    },
    watch: {
    'plate.name': function(newVal) {
      this.plate.name = newVal.toUpperCase();
    }
  },
    async created() {
      await this.fetchIngredients();
    },
    methods: {
      async fetchIngredients() {
        try {
          const response = await fetchWithAuth('http://localhost:8081/api/ingredients', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error);
          }
  
          this.ingredients = data;
        } catch (error) {
          this.errorMessage = error.message || 'Erro a obter ingredientes';
        }
      },
      addIngredient() {
        if (this.selectedIngredient && !this.plate.ingredients.includes(this.selectedIngredient)) {
          this.plate.ingredients.push(this.selectedIngredient);
          this.selectedIngredient = null;
        }
      },
      removeIngredient(index) {
        this.plate.ingredients.splice(index, 1);
      },
      async createPlate() {
        try {
          const response = await fetchWithAuth('http://localhost:8081/api/plates', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.plate)
          });
  
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error);
          }
  
          this.$router.push('/plates');
        } catch (error) {
          this.errorMessage = error.message || 'Erro a criar prato';
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