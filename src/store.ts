import {createStore} from "vuex";
import axios from "axios";
interface UserProps {
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
    user: UserProps
}
const store = createStore<GlobalDataProps>({
    state: {
        columns: [],
        posts: [],
        user: { isLogin: true, name: 'lzh', columnId: '5f3e86d62c56ee13bb830961' }
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
        }
    },
    actions: {
        fetchColumns(context) {
            axios.get('/columns').then(response => {
                context.commit('fetchColumns', response.data)
            })
        },
        fetchColumn(context, cid) {
            axios.get(`/columns/${cid}`).then(response => {
                context.commit('fetchColumn', response.data)
            })
        },
        fetchPosts(context, cid) {
            axios.get(`/columns/${cid}/posts`).then(response => {
                context.commit('fetchPosts', response.data)
            })
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
