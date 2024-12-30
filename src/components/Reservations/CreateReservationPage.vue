<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card shadow-sm">
          <div class="card-header">
            <h3>Criar reserva</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="createReservation">
              <div class="mb-3">
                <label for="date" class="form-label">Data</label>
                <input type="date" v-model="reservation.date" class="form-control" id="date" required />
              </div>
              <div class="mb-3">
                <label for="nifEmployee" class="form-label">NIF do funcionário</label>
                <input type="text" v-model="reservation.nifEmployee" class="form-control" id="nifEmployee" disabled />
              </div>
              <div class="mb-3">
                <label for="plate" class="form-label">Prato</label>
                <select v-model="reservation.plate" class="form-select" id="plate" required>
                  <option v-for="plate in plates" :key="plate._id" :value="plate._id">
                    {{ plate.name }}
                  </option>
                </select>
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
  name: 'CreateReservationPage',
  props: ['user'],
  data() {
    return {
      reservation: {
        date: '',
        nifEmployee: this.user.nif,
        plate: ''
      },
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
          throw new Error(data.message);
        }

        this.plates = data;
      } catch (error) {
        this.errorMessage = error.message || 'Erro a obter pratos';
      }
    },
    async createReservation() {
      try {
        const response = await fetchWithAuth('http://localhost:8081/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.reservation)
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        
        this.$emit('update-card-balance', this.user.employee.cardBalance - data.balanceRemoved);
        this.$router.push('/reservations');
      } catch (error) {
        this.errorMessage = error.message || 'Erro a criar reserva';
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