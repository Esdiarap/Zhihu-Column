import {createRouter, createWebHistory} from "vue-router";
import HomePage from "./views/HomePage.vue";
import LoginPage from "./views/LoginPage.vue";
import ColumnDetail from "./views/ColumnDetail.vue";
import CreatePost from "./views/CreatePost.vue";
import store from "./store";
import SignUpPage from "./views/SignUpPage.vue";
import axios from "axios";
import PostDetail from "./views/PostDetail.vue";

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
            meta: {redirectAlreadyLogin: true}
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignUpPage,
            meta: {redirectAlreadyLogin: true}
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
            meta: {requireLogin: true}
        },
        {
            path: '/posts/:id',
            name: 'posts',
            component: PostDetail
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return {
            top: 0
        }
    }
})
router.beforeEach((to, from, next) => {
    // if (to.meta.requireLogin && !store.state.user.isLogin) {
    //     next({name: 'login'})
    // } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    //     next('/')
    // } else {
    //     next()
    // }
    const {user, token} = store.state
    const {requiredLogin, redirectAlreadyLogin} = to.meta
    if (!user.isLogin) { // 没登录
        if (token) {// 有token
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
            store.dispatch('fetchCurrentUser')
                .then(() => { // 获取成功了
                    if (redirectAlreadyLogin) { // 需要重定向
                        next('/')
                    }else { // 不需要重定向
                        next()
                    }
                })
                .catch(e => {
                    console.error(e)
                    store.commit('logout')
                    next('/login')
                })
        }else {
            if (requiredLogin) {
                next('/login')
            }else {
                next()
            }
        }
    }else { // 登陆了
        if (redirectAlreadyLogin) { // 是否需要重定向
            next('/')
        }else { // 不需要重定向
            next()
        }
    }

})

export default router
