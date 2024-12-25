<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Tasks</h3>
            <button @click="goToCreateTask" class="btn btn-primary">Create Task</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Finished</th>
                    <th>Employee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in tasks" :key="task._id">
                    <td>{{ task._id }}</td>
                    <td>{{ task.description }}</td>
                    <td>{{ new Date(task.deadline).toLocaleDateString() }}</td>
                    <td>{{ task.finished ? 'Yes' : 'No' }}</td>
                    <td>{{ task.employee?.name }}</td>
                    <td>
                      <div class="btn-group" role="group">
                        <button v-if="user && user.role === 'Administrador' || user.role === 'Gestor'"
                          @click="goToEditTask(task._id)" class="btn btn-warning btn-sm me">Edit</button>
                        <button v-if="user && user.role === 'Administrador' || user.role === 'Gestor'"
                          @click="confirmDeleteTask(task._id)" class="btn btn-danger btn-sm">Delete</button>
                        <button @click="confirmFinishTask(task._id)" class="btn btn-success btn-sm">Finish</button>
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
      errorMessage: ''
    }
  },
  async created() {
    try {
      let url;
      switch (this.user.role) {
        case "Administrador":
          url = 'http://localhost:8080/api/tasks';
          break;
        case "Funcionario":
          url = `http://localhost:8080/api/tasks/employee/${this.user.employee.nif}`;
          break;
        default:
          url = 'http://localhost:8080/api/tasks';
          break;
      }
      const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      this.tasks = data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      this.errorMessage = 'Failed to fetch tasks. Please try again later.';
    }
  },
  methods: {
    goToCreateTask() {
      this.$router.push('/create-task');
    },
    goToEditTask(taskId) {
      this.$router.push(`/edit-task/${taskId}`);
    },
    confirmDeleteTask(taskId) {
      if (window.confirm('Are you sure you want to delete this task?')) {
        this.deleteTask(taskId);
      }
    },
    confirmFinishTask(taskId) {
      if (window.confirm('Are you sure you want to finish this task?')) {
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
          throw new Error('Failed to delete task');
        }

        // Remove the deleted task from the list
        this.tasks = this.tasks.filter(task => task._id !== taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
        this.errorMessage = 'Failed to delete task. Please try again later.';
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
          throw new Error('Failed to finish task');
        }

        const task = this.tasks.find(task => task._id === taskId);
        task.finished = true;
      } catch (error) {
        console.error('Error finishing task:', error);
        this.errorMessage = 'Failed to finish task. Please try again later.';
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