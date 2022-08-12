import {Commit, createStore} from "vuex";
import axios from "axios";
export interface UserProps {
    isLogin: boolean
    name?: string
    id?: string
    columnId?: string
}

export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}

export interface PostProps {
    _id: string;
    title: string;
    excerpt?: string
    content?: string;
    image?: ImageProps;
    createdAt: string;
    column: string;
}

export interface ImageProps {
    _id?: string
    url?: string
    createdAt?: string
}

export interface GlobalDataProps {
    columns: ColumnProps[]
    posts: PostProps[]
    user: UserProps,
    loading: false
}

const asyncAndAwait = async (url: string, mutationName: string, commit: Commit) => {
    const { data } = await axios.get(url)
    commit(mutationName, data)
}
const store = createStore<GlobalDataProps>({
    state: {
        columns: [],
        posts: [],
        user: { isLogin: true, name: 'lzh', columnId: '5f3e86d62c56ee13bb830961' },
        loading: false
    },
    mutations: {
        login(state) {
            state.user = {...state.user, isLogin: true, name: 'lzh'}
        },
        createPost(state, newPost) {
            state.posts.push(newPost)
        },
        fetchColumns(state, rawData) {
            state.columns = rawData.data.list
        },
        fetchColumn(state, rawData) {
            state.columns = [rawData.data]
        },
        fetchPosts(state, rawData) {
            state.posts = rawData.data.list
        },
        setLoading(state, status) {
            state.loading = status
        }
    },
    actions: {
        fetchColumns({ commit }) {
            asyncAndAwait('/columns', 'fetchColumns', commit)
        },
        fetchColumn({ commit }, cid) {
            asyncAndAwait(`/columns/${cid}`, 'fetchColumn', commit)
        },
        fetchPosts({ commit }, cid) {
            asyncAndAwait(`/columns/${cid}/posts`, 'fetchPosts', commit)
        },
    },
    getters:{
        columnNumber(state) {
            return state.columns.length
        },
        getColumnById: state => (id: string) => state.columns.find(col => col._id === id),
        getPostsById: state => (cid: string) => state.posts.filter(post => post.column === cid)
    }
})

export default store
