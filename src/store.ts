import {Commit, createStore} from "vuex";
import axios, {AxiosRequestConfig} from "axios";
import router from "./router";
import {arrToObj, objToArr} from "./apis/helpers";

// Post请求的返回值
export interface ResponseType<T = object> {
    code: number
    mas: string
    data: T
}

export interface UserProps {
    isLogin: boolean
    nickName?: string
    _id?: string
    column?: string
    email?: string
}

export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}

export interface PostProps {
    _id?: string;
    title: string;
    excerpt?: string
    content?: string;
    image?: ImageProps | string;
    createdAt?: string;
    column: string;
    author?: string | UserProps
    isHTML?: boolean
}

export interface ImageProps {
    _id?: string
    url?: string
    createdAt?: string
}

export interface GlobalErrorProps {
    status: boolean,
    message?: string
}

interface ListProps<T> {
    [id: string]: T
}

export interface GlobalDataProps {
    error: GlobalErrorProps
    columns: { data: ListProps<ColumnProps>, currentPage: number, total: number }
    posts: { data: ListProps<PostProps>, loadedColumns: ListProps<{ currentPage: number; total: number }>}
    user: UserProps,
    loading: false,
    token: string
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    const {data} = await axios.get(url)
    commit(mutationName, data)
    return data
}

const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
    const {data} = await axios.post(url, payload)
    commit(mutationName, data)
    return data
}

const asyncAndCommit = async (
    url: string,
    mutationName: string,
    commit: Commit,
    config: AxiosRequestConfig = {method: 'get'},
    extraData?: any
) => {
    const {data} = await axios(url, config)
    if (extraData) {
        commit(mutationName, {data, extraData})
    } else {
        commit(mutationName, data)
    }
    return data
}
const store = createStore<GlobalDataProps>({
    state: {
        columns: {data: {}, currentPage: 0, total: 0},
        posts: {data: {}, loadedColumns: {}},
        user: {isLogin: false},
        loading: false,
        token: localStorage.getItem('token') || '',
        error: {status: false}
    },
    mutations: {
        login(state, rawData) {
            // state.user = {...state.user, isLogin: true, name: 'lzh'}
            const {token} = rawData.data
            state.token = token
            localStorage.setItem('token', token)
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
        },
        logout(state) {
            state.token = ''
            state.user.isLogin = false
            localStorage.removeItem('token')
            delete axios.defaults.headers.common.Authorization
            router.push('/')
        },
        createPost(state, newPost) {
            state.posts.data[newPost._id] = newPost
        },
        fetchColumns(state, rawData) {
            const {data} = state.columns
            const {list, count, currentPage} = rawData.data
            state.columns = {
                data: {...data, ...arrToObj(list)}, // 把加载的Columns都推进去
                total: count,
                currentPage: +currentPage
            }
        },
        fetchColumn(state, rawData) {
            state.columns.data[rawData.data._id] = rawData.data
        },
        fetchPosts(state, {data: rawData, extraData: columnId}) {
            const {list, currentPage, count} = rawData.data
            const {data} = state.posts
            state.posts.data = {...data, ...arrToObj(list)} // 把新的posts数据push到里面
            state.posts.loadedColumns = {...state.posts.loadedColumns, ...{[columnId]: {currentPage, total: count} }}
        },
        fetchPost(state, rawData) {
            state.posts.data[rawData.data._id] = rawData.data // 此时只有一个Post了，posts数组只有一项，但是也要用数组包裹起来。而且此处获取的Post是有Content的
        },
        setLoading(state, status) {
            state.loading = status
        },
        setError(state, e: GlobalErrorProps) {
            state.error = e
        },
        fetchCurrentUser(state, rawData) {
            state.user = {isLogin: true, ...rawData.data}
        },
        updatePost(state, {data}) {
            state.posts.data[data._id] = data
        },
        deletePost(state, {data}) {
            delete state.posts.data[data._id]
        }
    },
    actions: {
        fetchColumns({state, commit}, payload = {}) {
            const {currentPage = 1, pageSize = 6} = payload
            if (state.columns.currentPage < currentPage) {
                return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit, {method: 'get'})
            }
        },
        fetchColumn({state, commit}, cid) {
            if (!state.columns.data[cid]) {
                return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
            }
        },
        fetchPosts({state, commit}, payload) {
            const {currentPage = 1, pageSize = 6, cid} = payload
            if (!state.posts.loadedColumns[cid]) {
                return asyncAndCommit(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, {method: 'get'}, cid) // 把columnId带上
            }else if (state.posts.loadedColumns[cid]?.currentPage < currentPage) {
                return asyncAndCommit(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, {method: 'get'}, cid) // 把columnId带上
            }
        },
        fetchPost({state, commit}, pid) {
            const currentPost = state.posts.data[pid]
            if (!currentPost || !currentPost.content) { // 当前的post都不存在，或者是通过点击post详情获取的post，而非在ColumnDetail界面获取的粗糙版的post
                return getAndCommit(`/posts/${pid}`, 'fetchPost', commit)
            }
            // 如果post已经存在了，那就返回一个Promise.resolve带着当前数据回去，不然在编辑Post的时候，它是通过
            // fetchPost获取当前Post的数据的，不返回就会报错
            return Promise.resolve({data: currentPost})

        },
        login({commit}, payload) {
            return postAndCommit('/user/login', 'login', commit, payload)
        },
        fetchCurrentUser({commit}) {
            return getAndCommit('/user/current', 'fetchCurrentUser', commit)
        },
        async loginAndFetchCurrentUser({dispatch}, loginData) {
            await dispatch('login', loginData)
            return await dispatch('fetchCurrentUser')
        },
        createPost({commit}, payload) {
            return postAndCommit('/posts', 'createPost', commit, payload)
        },
        updatePost({commit}, {id, payload}) {
            return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
                method: 'patch',
                data: payload
            })
        },
        deletePost({commit}, id) {
            return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {method: 'delete'})
        }
    },
    getters: {
        getColumnById: state => (id: string) => state.columns.data[id],
        getPostsById: state => (cid: string) => objToArr(state.posts.data).filter(post => post.column === cid),
        getPostById: state => (pid: string) => state.posts.data[pid],
        getColumns: state => objToArr(state.columns.data)
    }
})

export default store
