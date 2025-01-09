<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h3>Criar funcionário</h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="createEmployee">
                            <div class="form-group mb-3">
                                <label for="name">Nome</label>
                                <input type="text" v-model="name" class="form-control" id="name" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="nif">NIF</label>
                                <input type="text" v-model="nif" class="form-control" id="nif" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="department">Departamento</label>
                                <select v-model="department" class="form-control" id="department" required>
                                    <option v-for="dept in departments" :key="dept._id" :value="dept._id">
                                        {{ dept.name }}
                                    </option>
                                </select>
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
    name: 'CreateEmployeePage',
    data() {
        return {
            name: '',
            nif: '',
            department: '',
            errorMessage: '',
            departments: []
        }
    },
    async created() {
        try {
            // Fetch departments
            const departmentsResponse = await fetchWithAuth('http://localhost:8080/api/department', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const departmentsData = await departmentsResponse.json();
            if (!departmentsResponse.ok) {
                throw new Error(departmentsData.error);
            }

            this.departments = departmentsData;
        } catch (error) {
            this.errorMessage = error.message || 'Erro a listar departamentos.';
        }

    },
    methods: {
        async createEmployee() {
            try {
                const response = await fetchWithAuth('http://localhost:8080/api/employee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.name,
                        nif: this.nif,
                        department: this.department
                    })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error);
                }

                this.errorMessage = '';
                this.$router.push('/employees');
            } catch (error) {
                this.errorMessage = error.message || 'Erro ao criar funcionário.';
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