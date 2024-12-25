<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h3>Edit Employee</h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="editEmployee">
                            <div class="form-group mb-3">
                                <label for="name">Name</label>
                                <input type="text" v-model="name" class="form-control" id="name" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="nif">NIF</label>
                                <input type="text" v-model="nif" class="form-control" id="nif" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="department">Department</label>
                                <select v-model="department" class="form-control" id="department" required>
                                    <option v-for="dept in departments" :key="dept._id" :value="dept._id">
                                        {{ dept.name }}
                                    </option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">Save</button>
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
            // Fetch employee details
            const employeeResponse = await fetchWithAuth(`http://localhost:8080/api/employee/${employeeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!employeeResponse.ok) {
                throw new Error('Failed to fetch employee');
            }

            const employeeData = await employeeResponse.json();
            this.name = employeeData.name;
            this.nif = employeeData.nif;
            this.department = employeeData.department?._id;

            // Fetch departments
            const departmentsResponse = await fetchWithAuth('http://localhost:8080/api/department', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
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
                    throw new Error('Failed to update employee');
                }

                const data = await response.json();
                console.log('Employee updated successfully:', data);
                this.errorMessage = ''; // Clear any previous error message
                this.$router.push('/employees'); // Redirect to employees page
            } catch (error) {
                console.error('Error updating employee:', error);
                this.errorMessage = 'Failed to update employee. Please try again later.';
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