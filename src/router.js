import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './components/LoginPage.vue'
import RegisterPage from './components/RegisterPage.vue'
import DepartmentsPage from './components/DepartmentsPage.vue'
import CreateDepartmentPage from './components/CreateDepartmentPage.vue'
import EditDepartmentPage from './components/EditDepartmentPage.vue'
import EmployeesPage from './components/EmployeesPage.vue'
import CreateEmployeePage from './components/CreateEmployeePage.vue'
import EditEmployeePage from './components/EditEmployeePage.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/departments', component: DepartmentsPage },
  { path: '/create-department', component: CreateDepartmentPage },
  { path: '/edit-department/:id', component: EditDepartmentPage },
  { path: '/employees', component: EmployeesPage },
  { path: '/create-employee', component: CreateEmployeePage },
  { path: '/edit-employee/:id', component: EditEmployeePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router