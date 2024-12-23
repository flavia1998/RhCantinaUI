<template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-4 mb-3" v-for="link in links" :key="link.path">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{{ link.title }}</h5>
                  <p class="card-text">{{ link.description }}</p>
                  <router-link :to="link.path" class="btn btn-primary">{{ link.buttonText }}</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardPage',
    data() {
      return {
        links: [
          {
            title: 'Departments',
            description: 'View and manage departments',
            path: '/departments',
            buttonText: 'Go to Departments'
          },
          {
            title: 'Employees',
            description: 'View and manage employees',
            path: '/employees',
            buttonText: 'Go to Employees'
          },
          {
            title: 'Tasks',
            description: 'View and manage tasks',
            path: '/tasks',
            buttonText: 'Go to Tasks'
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    margin-top: 50px;
  }
  </style>