<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h3>Create Employee</h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="createEmployee">
                            <div class="form-group mb-3">
                                <label for="name">Name</label>
                                <input type="text" v-model="name" class="form-control" id="name" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="nif">NIF</label>
                                <input type="text" v-model="nif" class="form-control" id="nif" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="cardBalance">Card Balance</label>
                                <input type="number" v-model="cardBalance" class="form-control" id="cardBalance"
                                    required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="role">Role</label>
                                <select v-model="role" class="form-control" id="role" required>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Gestor">Gestor</option>
                                    <option value="Funcionario">Funcionario</option>
                                </select>
                            </div>
                            <div class="form-group mb-3">
                                <label for="department">Department</label>
                                <select v-model="department" class="form-control" id="department" required>
                                    <option v-for="dept in departments" :key="dept._id" :value="dept._id">
                                        {{ dept.name }}
                                    </option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">Create</button>
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
export default {
    name: 'CreateEmployeePage',
    data() {
        return {
            name: '',
            nif: '',
            cardBalance: 0,
            role: '',
            department: '',
            errorMessage: '',
            departments: []
        }
    },
    async created() {
        try {
            // Fetch departments
            const departmentsResponse = await fetch('http://localhost:8080/api/department', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });

            if (!departmentsResponse.ok) {
                throw new Error('Failed to fetch departments');
            }

            const departmentsData = await departmentsResponse.json();
            this.departments = departmentsData;
        } catch (error) {
            console.error('Error fetching data:', error);
            this.errorMessage = 'Failed to fetch data. Please try again later.';
        }
    },
    methods: {
        async createEmployee() {
            try {
                const response = await fetch('http://localhost:8080/api/employee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                    },
                    body: JSON.stringify({
                        name: this.name,
                        nif: this.nif,
                        cardBalance: this.cardBalance,
                        role: this.role,
                        department: this.department
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to create employee');
                }

                const data = await response.json();
                console.log('Employee created successfully:', data);
                this.errorMessage = ''; // Clear any previous error message
                this.$router.push('/employees'); // Redirect to employees page
            } catch (error) {
                console.error('Error creating employee:', error);
                this.errorMessage = 'Failed to create employee. Please try again later.';
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