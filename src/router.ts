import {createRouter, createWebHistory} from "vue-router";
import HomePage from "./views/HomePage.vue";
import LoginPage from "./views/LoginPage.vue";
import ColumnDetail from "./views/ColumnDetail.vue";
import CreatePost from "./views/CreatePost.vue";
import store from "./store";

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
            component: LoginPage,
            meta: { redirectAlreadyLogin: true}
        },
        {
            path: '/column/:id',
            name: 'column',
            component: ColumnDetail
        },
        {
            path: '/create',
            name: 'create',
            component: CreatePost,
            meta: { requireLogin: true }
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return {
            top: 0
        }
    }
})
router.beforeEach((to, from, next) => {
    if (to.meta.requireLogin && !store.state.user.isLogin) {
        next({name: 'login'})
    }else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
        next('/')
    }else {
        next()
    }
})

export default router
