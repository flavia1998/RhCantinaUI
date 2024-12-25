<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3>Employee Details</h3>
            </div>
            <div class="card-body">
              <div v-if="employee">
                <p><strong>ID:</strong> {{ employee._id }}</p>
                <p><strong>Name:</strong> {{ employee.name }}</p>
                <p><strong>NIF:</strong> {{ employee.nif }}</p>
                <p><strong>Card Balance:</strong> {{ employee.cardBalance }}</p>
                <p><strong>Department:</strong> {{ employee.department?.name }}</p>
                <p>{{ user.nif }}</p>
                <button v-if="user && user.nif.toString() === employee.nif" @click="showAddBalanceModal" class="btn btn-primary mt-3">Add Balance</button>
              </div>
              <div v-else>
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add Balance Modal -->
      <div class="modal fade" id="addBalanceModal" tabindex="-1" aria-labelledby="addBalanceModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addBalanceModalLabel">Add Balance</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="balanceAmount" class="form-label">Amount</label>
                <input type="number" v-model="balanceAmount" class="form-control" id="balanceAmount" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="addBalance">Add Balance</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { fetchWithAuth } from '@/api';
  import * as bootstrap from 'bootstrap';

  export default {
    name: 'ViewEmployeePage',
    props: ['user'],
    data() {
      return {
        employee: null,
        errorMessage: '',
        balanceAmount: 0
      };
    },
    async created() {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/employee/${this.$route.params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch employee');
        }
  
        const data = await response.json();
        this.employee = data;
      } catch (error) {
        console.error('Error fetching employee:', error);
        this.errorMessage = 'Failed to fetch employee. Please try again later.';
      }
    },
    methods: {
      goBack() {
        this.$router.push('/employees');
      },
      showAddBalanceModal() {
        const modal = new bootstrap.Modal(document.getElementById('addBalanceModal'));
        modal.show();
      },
      async addBalance() {
        try {
          const response = await fetchWithAuth(`http://localhost:8080/api/employee/${this.employee.nif}/addBalance`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: this.balanceAmount })
          });
  
          if (!response.ok) {
            throw new Error('Failed to add balance');
          }
  
          this.employee.cardBalance = this.employee.cardBalance + this.balanceAmount;
          const modal = bootstrap.Modal.getInstance(document.getElementById('addBalanceModal'));
          modal.hide();
        } catch (error) {
          console.error('Error adding balance:', error);
          this.errorMessage = 'Failed to add balance. Please try again later.';
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