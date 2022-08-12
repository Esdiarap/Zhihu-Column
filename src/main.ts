import { createApp } from 'vue'
import {createRouter, createWebHistory} from "vue-router";
import './style.css'
import App from './App.vue'
import HomePage from "./views/HomePage.vue";
import LoginPage from "./views/LoginPage.vue";
import ColumnDetail from "./views/ColumnDetail.vue";

const routerHistory = createWebHistory()
const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage
        },
        {
            path: '/column/:id',
            name: 'column',
            component: ColumnDetail
        }
    ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
