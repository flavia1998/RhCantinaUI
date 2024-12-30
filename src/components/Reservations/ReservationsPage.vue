<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Reservas</h3>
            <button @click="goToCreateReservation" class="btn btn-primary">Criar reserva</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>NIF do funcionário</th>
                    <th>Prato</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="reservation in reservations" :key="reservation._id">
                    <td>{{ new Date(reservation.date).toLocaleDateString() }}</td>
                    <td>{{ reservation.nifEmployee }}</td>
                    <td>{{ reservation.plate.name }}</td>
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
  name: 'ReservationsPage',
  data() {
    return {
      reservations: [],
      errorMessage: ''
    };
  },
  async created() {
    await this.fetchReservations();
  },
  methods: {
    async fetchReservations() {
      try {
        const response = await fetchWithAuth('http://localhost:8081/api/reservations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        this.reservations = data;
      } catch (error) {
        this.errorMessage = error.message || 'Erro a listar reservas.';
      }
    },
    goToCreateReservation() {
      this.$router.push('/create-reservation');
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 50px;
}
</style>