<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h3>Editar funcionário</h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="editEmployee">
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
                            <div class="form-group mb-3">
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
    name: 'EditEmployeePage',
    data() {
        return {
            name: '',
            nif: '',
            department: '',
            departments: [],
            errorMessage: ''
        }
    },
    async created() {
        const employeeId = this.$route.params.id;
        try {
            const employeeResponse = await fetchWithAuth(`http://localhost:8080/api/employee/${employeeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const employeeData = await employeeResponse.json();
            if (!employeeResponse.ok) {
                throw new Error(employeeData.error);
            }

            this.name = employeeData.name;
            this.nif = employeeData.nif;
            this.department = employeeData.department?._id;

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
            this.errorMessage = error.message || 'Erro ao carregar dados do funcionário.';
        }
    },
    methods: {
        async editEmployee() {
            const employeeId = this.$route.params.id;
            try {
                const response = await fetchWithAuth(`http://localhost:8080/api/employee/${employeeId}`, {
                    method: 'PUT',
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
                this.errorMessage = error.message || 'Erro ao editar funcionário.';
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