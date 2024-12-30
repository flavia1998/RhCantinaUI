<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Pratos</h3>
            <button v-if="user && user.role === 'Administrador'" @click="goToCreatePlate" class="btn btn-primary">Criar prato</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Ingredientes</th>
                    <th>Preço</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="dish in plates" :key="dish._id">
                    <td>{{ dish.name }}</td>
                    <td>{{ dish.type }}</td>
                    <td>
                      <ul>
                        <li v-for="ingredient in dish.ingredients" :key="ingredient._id">
                          {{ ingredient.nome }} <span v-if="ingredient.alergico">(Alergénico)</span>
                        </li>
                      </ul>
                    </td>
                    <td>{{ dish.price }}</td>
                    <td>
                      <div class="btn-group" role="group">
                        <button @click="goToViewPlate(dish._id)" class="btn btn-primary">Ver</button>
                        <button v-if="user && user.role === 'Administrador'" @click="goToEditPlate(dish._id)" class="btn btn-warning">Editar</button>
                        <button v-if="user && user.role === 'Administrador'" @click="confirmDeletePlate(dish._id)" class="btn btn-danger">Remover</button>
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
  name: 'PlatesPage',
  props: ['user'],
  data() {
    return {
      plates: [],
      errorMessage: ''
    };
  },
  async created() {
    await this.fetchPlates();
  },
  methods: {
    async fetchPlates() {
      try {
        const response = await fetchWithAuth('http://localhost:8081/api/plates', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        this.plates = data;
      } catch (error) {
        this.errorMessage = error.message || 'Erro a listar pratos.';
      }
    },
    goToCreatePlate() {
      this.$router.push('/create-plate');
    },
    goToViewPlate(plateId) {
      this.$router.push(`/view-plate/${plateId}`);
    },
    goToEditPlate(plateId) {
      this.$router.push(`/edit-plate/${plateId}`);
    },
    confirmDeletePlate(plateId) {
      if (window.confirm('Tem a certeza que deseja remover este prato?')) {
        this.deletePlate(plateId);
      }
    },
    async deletePlate(plateId) {
      try {
        const response = await fetchWithAuth(`http://localhost:8081/api/plates/${plateId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }

        // Remove the deleted plate from the list
        this.plates = this.plates.filter(plate => plate._id !== plateId);
      } catch (error) {
        this.errorMessage = error.message || 'Erro a remover prato';
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