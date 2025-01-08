<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Tarefas</h3>
            <div class="d-flex align-items-center">
              <select v-if="user && user.role === 'Gestor'" v-model="selectedEmployee" @change="fetchTasks"
                class="form-select me-2 custom-select">
                <option v-for="employee in employees" :key="employee.nif" :value="employee.nif">
                  {{ employee.name }}
                </option>
              </select>
              <button v-if="user && user.role !== 'Funcionario'" @click="goToCreateTask" class="btn btn-primary">Criar tarefa</button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descrição</th>
                    <th>Data limite</th>
                    <th>Terminada</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in tasks" :key="task._id">
                    
                    <td>{{ task._id }}</td>
                    <td>{{ task.description }}</td>
                    <td>{{ new Date(task.deadline).toLocaleDateString() }}</td>
                    <td class="symbol">
                        <span v-if="task.finished" style="color: green;">✓</span>
                        <span v-else style="color: red;">✗</span>
                    </td>
                    <td>
                      <div class="btn-group" role="group">
                        <button @click="goToViewTask(task._id)" class="btn btn-primary">Ver</button>
                        <button v-if="user && (user.role === 'Administrador' || user.role === 'Gestor')"
                          @click="goToEditTask(task._id)" class="btn btn-warning me">Editar</button>
                        <button v-if="user && (user.role === 'Administrador' || user.role === 'Gestor')"
                          @click="confirmDeleteTask(task._id)" class="btn btn-danger">Remover</button>
                        <button v-if="!task.finished" @click="confirmFinishTask(task._id)"
                          class="btn btn-success">Terminar</button>
                      </div>
                    </td>
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
  name: 'TasksPage',
  props: ['user'],
  data() {
    return {
      tasks: [],
      employees: [],
      selectedEmployee: '',
      errorMessage: ''
    };
  },
  async created() {
    if (this.user && this.user.role === 'Gestor') {
      this.selectedEmployee = this.user.employee.nif;
    }
    await this.fetchEmployees();
    await this.fetchTasks();
  },
  methods: {
    async fetchEmployees() {
      if (this.user && this.user.role === 'Gestor') {
        try {
          const response = await fetchWithAuth(`http://localhost:8080/api/employee/department/${this.user.employee.department._id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error);
          }

          this.employees = data;
        } catch (error) {
          this.errorMessage = error.message || 'Erro a listar funcionários.';
        }
      }
    },
    async fetchTasks() {
      try {
        let url;
        if (this.user.role === 'Administrador') {
          url = 'http://localhost:8080/api/tasks';
        } else if (this.user.role === 'Gestor' && this.selectedEmployee) {
          url = `http://localhost:8080/api/tasks/employee/${this.selectedEmployee}`;
        } else {
          url = `http://localhost:8080/api/tasks/employee/${this.user.employee.nif}`;
        }

        const response = await fetchWithAuth(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        this.tasks = data;
      } catch (error) {
        this.errorMessage = error.message || 'Erro a listar tarefas.';
      }
    },
    goToCreateTask() {
      this.$router.push('/create-task');
    },
    goToViewTask(taskId) {
      this.$router.push(`/view-task/${taskId}`);
    },
    goToEditTask(taskId) {
      this.$router.push(`/edit-task/${taskId}`);
    },
    confirmDeleteTask(taskId) {
      if (window.confirm('Tem a certeza que deseja remover a tarefa?')) {
        this.deleteTask(taskId);
      }
    },
    confirmFinishTask(taskId) {
      if (window.confirm('Tem a certeza que deseja terminar a tarefa?')) {
        this.finishTask(taskId);
      }
    },
    async deleteTask(taskId) {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        // Remove the deleted task from the list
        this.tasks = this.tasks.filter(task => task._id !== taskId);
      } catch (error) {
        this.errorMessage = error.message || 'Erro a eliminar tarefa!';
      }
    },
    async finishTask(taskId) {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/tasks/${taskId}/finish`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }

        const task = this.tasks.find(task => task._id === taskId);
        task.finished = true;
      } catch (error) {
        this.errorMessage = error.message || 'Erro a terminar tarefa!';
      }
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 50px;
}

.custom-select {
  width: 200px;
}

.symbol {
  font-size: 18px; 
  text-align: center;
  vertical-align: middle;
  line-height: 1.5;  
}
</style>