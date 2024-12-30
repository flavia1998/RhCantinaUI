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
import UsersPage from './components/Users/UsersPage.vue';
import EditUserPage from './components/Users/EditUserPage.vue'; // Import the new EditUserPage component
import ViewDepartmentPage from './components/Departments/ViewDepartmentPage.vue'; // Import the new ViewDepartmentPage component
import ViewEmployeePage from './components/Employees/ViewEmployeePage.vue'; // Import the new ViewEmployeePage component
import Plates from './components/Plates/PlatesPage.vue';
import EditPlatePage from './components/Plates/EditPlatePage.vue';
import CreatePlatePage from './components/Plates/CreatePlatePage.vue';
import IngredientsPage from './components/Ingredients/IngredientsPage.vue';
import CreateIngredientPage from './components/Ingredients/CreateIngredientPage.vue';
import EditIngredientPage from './components/Ingredients/EditIngredientPage.vue';
import ViewPlatePage from './components/Plates/ViewPlatePage.vue';
import ViewTaskPage from './components/Tasks/ViewTaskPage.vue';
import ReservationsPage from './components/Reservations/ReservationsPage.vue';
import CreateReservationPage from './components/Reservations/CreateReservationPage.vue';

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/departments', component: DepartmentsPage, meta: { roles: ['Administrador'] } },
  { path: '/create-department', component: CreateDepartmentPage, meta: { roles: ['Administrador'] } },
  { path: '/edit-department/:id', component: EditDepartmentPage, meta: { roles: ['Administrador'] } },
  { path: '/view-department/:id', component: ViewDepartmentPage, meta: { roles: ['Administrador', 'Gestor'] } },
  { path: '/employees', component: EmployeesPage, meta: { roles: ['Administrador', 'Gestor'] } },
  { path: '/create-employee', component: CreateEmployeePage, meta: { roles: ['Administrador'] } },
  { path: '/edit-employee/:id', component: EditEmployeePage, meta: { roles: ['Administrador'] } },
  { path: '/view-employee/:id', component: ViewEmployeePage },
  { path: '/tasks', component: TasksPage, meta: { roles: ['Administrador', 'Gestor', 'Funcionario'] } },
  { path: '/create-task', component: CreateTaskPage, meta: { roles: ['Administrador', 'Gestor'] } },
  { path: '/edit-task/:id', component: EditTaskPage, meta: { roles: ['Administrador', 'Gestor'] } },
  { path: '/users', component: UsersPage, meta: { roles: ['Administrador'] } },
  { path: '/edit-user/:username', component: EditUserPage, meta: { roles: ['Administrador'] } },
  { path: '/', component: DashboardPage },
  { path: '/plates', name: 'PlatesPage', component: Plates },
  { path: '/edit-plate/:plateId', name: 'EditPlatePage', component: EditPlatePage, meta: { roles: ['Administrador'] } },
  { path: '/create-plate', name: 'CreatePlatePage', component: CreatePlatePage, meta: { roles: ['Administrador'] } },
  { path: '/ingredients', name: 'IngredientsPage', component: IngredientsPage },
  { path: '/create-ingredient', name: 'CreateIngredientPage', component: CreateIngredientPage, meta: { roles: ['Administrador'] } },
  { path: '/edit-ingredient/:ingredientId', name: 'EditIngredientPage', component: EditIngredientPage, meta: { roles: ['Administrador'] } },
  { path: '/view-plate/:plateId', name: 'ViewPlatePage', component: ViewPlatePage },
  { path: '/view-task/:taskId', name: 'ViewTaskPage', component: ViewTaskPage },
  { path: '/reservations', name: 'ReservationsPage', component: ReservationsPage },
  { path: '/create-reservation', name: 'CreateReservationPage', component: CreateReservationPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authPages = ['/login', '/register'];
  const authRequired = !authPages.includes(to.path);
  const userString = localStorage.getItem('user');

  if (authRequired && !userString) {
    return next('/login');
  }

  if (userString && authPages.includes(to.path)) {
    return next('/');
  }

  if (!authPages.includes(to.path)) {
    const user = JSON.parse(userString);
    if (to.meta.roles) {
      if (!to.meta.roles.includes(user.role)) {
        return next('/'); // Redirect to home if the user does not have the required role
      }
    }
  }

  next();
});

export default router;