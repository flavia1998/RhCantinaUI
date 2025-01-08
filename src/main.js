import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootswatch/dist/flatly/bootstrap.min.css' // Import Flatly theme
import 'bootstrap'

createApp(App).use(router).mount('#app')