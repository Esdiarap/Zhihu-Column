import {createRouter, createWebHistory} from "vue-router";
import HomePage from "./views/HomePage.vue";
import LoginPage from "./views/LoginPage.vue";
import ColumnDetail from "./views/ColumnDetail.vue";
import CreatePost from "./views/CreatePost.vue";

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
        },
        {
            path: '/create',
            name: 'create',
            component: CreatePost
        }
    ]
})
export default router
