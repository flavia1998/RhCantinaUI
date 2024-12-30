<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h3>Editar utilizador</h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="updateUser">
                            <div class="mb-3">
                                <label for="username" class="form-label">Nome de utilizador</label>
                                <input type="text" id="username" v-model="user.username" class="form-control" disabled />
                            </div>
                            <div class="mb-3">
                                <label for="nif" class="form-label">NIF</label>
                                <select id="nif" v-model="user.nif" class="form-select" required>
                                    <option v-for="employee in employees" :key="employee.nif" :value="employee.nif">
                                        {{ employee.name }} ({{ employee.nif }})
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="role" class="form-label">Função</label>
                                <select id="role" v-model="user.role" class="form-select">
                                    <option value="Administrador">Administrador</option>
                                    <option value="Funcionario">Funcionário</option>
                                </select>
                            </div>
                            <div class="form-group mb-3">
                                <div class="form-check">
                                    <input type="checkbox" v-model="user.is_active" class="form-check-input" id="active">
                                    <label class="form-check-label" for="active">Ativo</label>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Guardar</button>
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
    name: 'EditUserPage',
    data() {
        return {
            user: {
                username: '',
                nif: '',
                role: '',
                is_active: false
            },
            employees: [],
            errorMessage: ''
        };
    },
    async created() {
        const username = this.$route.params.username;
        try {
            const userResponse = await fetchWithAuth(`http://localhost:8080/api/user/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const userData = await userResponse.json();
            if (!userResponse.ok) {
                throw new Error(userData.error);
            }

            this.user = userData;
            if (this.user.role === 'Gestor') {
                this.user.role = 'Funcionario';
            }
            
            const employeesResponse = await fetchWithAuth('http://localhost:8080/api/employee', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const employeesData = await employeesResponse.json();
            if (!employeesResponse.ok) {
                throw new Error(employeesData.error);
            }

            this.employees = employeesData;

            if (this.user.nif) {
                const selectedEmployee = this.employees.find(employee => employee.nif === this.user.nif);
                if (selectedEmployee) {
                    this.user.nif = selectedEmployee.nif;
                }
            }
        } catch (error) {
            this.errorMessage = error.message || 'Erro a listar dados!';
        }
    },
    methods: {
        async updateUser() {
            try {
                const response = await fetchWithAuth(`http://localhost:8080/api/user/${this.user.username}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.user)
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error);
                }

                this.$router.push('/users');
            } catch (error) {
                this.errorMessage = error.message || 'Erro ao editar utilizador.';
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