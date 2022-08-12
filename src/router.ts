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
    // scrollBehavior(to, from, savedPosition) {
    //     return {
    //         top: 0
    //     }
    // }
})
router.beforeEach((to, from, next) => {
    if (to.meta.requireLogin && !store.state.user.isLogin) {
        console.log('重定向到login')
        next({name: 'login'})
    }else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
        console.log('重定向到首页')
        next('/')
    }else {
        console.log('to.meta is ', to.meta)
        console.log('isLogin', store.state.user.isLogin)
        next()
    }
})

export default router
