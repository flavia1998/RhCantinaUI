<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h3>Ingredientes</h3>
              <button @click="goToCreateIngredient" class="btn btn-primary">Create Ingredient</button>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Alergénico</th>
                      <th v-if="user && user.role === 'Administrador'">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="ingredient in ingredients" :key="ingredient._id">
                      <td>{{ ingredient.nome }}</td>
                      <td>{{ ingredient.alergico ? 'Sim' : 'Não' }}</td>
                      <td v-if="user && user.role === 'Administrador'">
                        <div class="btn-group" role="group">
                          <button @click="goToEditIngredient(ingredient._id)" class="btn btn-warning">Editar</button>
                          <button @click="confirmDeleteIngredient(ingredient._id)" class="btn btn-danger">Remover</button>
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
    name: 'IngredientsPage',
    props: ['user'],
    data() {
      return {
        ingredients: [],
        errorMessage: ''
      };
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
          this.errorMessage = error.message || 'Erro a listar ingredientes.';
        }
      },
      goToCreateIngredient() {
        this.$router.push('/create-ingredient');
      },
      goToEditIngredient(ingredientId) {
        this.$router.push(`/edit-ingredient/${ingredientId}`);
      },
      confirmDeleteIngredient(ingredientId) {
        if (window.confirm('Tem a certeza que deseja remover o igrediente?')) {
          this.deleteIngredient(ingredientId);
        }
      },
      async deleteIngredient(ingredientId) {
        try {
          const response = await fetchWithAuth(`http://localhost:8081/api/ingredients/${ingredientId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error);
          }
  
          // Remove the deleted ingredient from the list
          this.ingredients = this.ingredients.filter(ingredient => ingredient._id !== ingredientId);
        } catch (error) {
          this.errorMessage = error.message || 'Erro a remover ingrediente';
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