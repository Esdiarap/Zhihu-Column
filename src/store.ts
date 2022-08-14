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
    columns: ListProps<ColumnProps>
    posts: ListProps<PostProps>
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

const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = {method: 'get'}) => {
    const {data} = await axios(url, config)
    commit(mutationName, data)
    return data
}
const store = createStore<GlobalDataProps>({
    state: {
        columns: {},
        posts: {},
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
            state.posts[newPost._id] = newPost
        },
        fetchColumns(state, rawData) {
            state.columns = arrToObj(rawData.data.list)
        },
        fetchColumn(state, rawData) {
            state.columns[rawData.data._id] = rawData.data
        },
        fetchPosts(state, rawData) {
            state.posts = arrToObj(rawData.data.list)
        },
        fetchPost(state, rawData) {
            state.posts[rawData.data._id] = rawData.data // 此时只有一个Post了，posts数组只有一项，但是也要用数组包裹起来。而且此处获取的Post是有Content的
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
            state.posts[data._id] = data
        },
        deletePost(state, {data}) {
            delete state.posts[data._id]
        }
    },
    actions: {
        fetchColumns({commit}) {
            return getAndCommit('/columns', 'fetchColumns', commit)
        },
        fetchColumn({commit}, cid) {
            return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
        },
        fetchPosts({commit}, cid) {
            return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
        },
        fetchPost({commit}, pid) {
            return getAndCommit(`/posts/${pid}`, 'fetchPost', commit)
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
            return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {method: 'patch', data: payload})
        },
        deletePost({commit}, id) {
            return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {method: 'delete'})
        }
    },
    getters: {
        columnNumber(state) {
            return state.columns.length
        },
        getColumnById: state => (id: string) => state.columns[id],
        getPostsById: state => (cid: string) => objToArr(state.posts).filter(post => post.column === cid),
        getPostById: state => (pid: string) => state.posts[pid],
        getColumns: state => objToArr(state.columns)
    }
})

export default store
