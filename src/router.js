import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './components/LoginPage.vue'
import RegisterPage from './components/RegisterPage.vue'
import DepartmentsPage from './components/Departments/DepartmentsPage.vue'
import CreateDepartmentPage from './components/Departments/CreateDepartmentPage.vue'
import EditDepartmentPage from './components/Departments/EditDepartmentPage.vue'
import EmployeesPage from './components/Employees/EmployeesPage.vue'
import CreateEmployeePage from './components/Employees/CreateEmployeePage.vue'
import EditEmployeePage from './components/Employees/EditEmployeePage.vue'
import TasksPage from './components/Tasks/TasksPage.vue'
import CreateTaskPage from './components/Tasks/CreateTaskPage.vue'
import EditTaskPage from './components/Tasks/EditTaskPage.vue'
import DashboardPage from './components/DashboardPage.vue'

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/departments', component: DepartmentsPage },
  { path: '/create-department', component: CreateDepartmentPage },
  { path: '/edit-department/:id', component: EditDepartmentPage },
  { path: '/employees', component: EmployeesPage },
  { path: '/create-employee', component: CreateEmployeePage },
  { path: '/edit-employee/:id', component: EditEmployeePage },
  { path: '/tasks', component: TasksPage },
  { path: '/create-task', component: CreateTaskPage },
  { path: '/edit-task/:id', component: EditTaskPage },
  { path: '/', component: DashboardPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authPages = ['/login', '/register'];
  const authRequired = !authPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  if (loggedIn && authPages.includes(to.path)) {
    return next('/');
  }

  next();
});

export default router