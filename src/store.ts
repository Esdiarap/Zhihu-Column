import {createStore} from "vuex";
import {testData, ColumnProps, PostProps, testPosts} from './testData'
interface UserProps {
    isLogin: boolean
    name?: string
    id?: number
    columnId?: number
}

export interface GlobalDataProps {
    columns: ColumnProps[]
    posts: PostProps[]
    user: UserProps
}
const store = createStore<GlobalDataProps>({
    state: {
        columns: testData,
        posts: testPosts,
        user: { isLogin: true, name: 'lzh', columnId: 1 }
    },
    mutations: {
        login(state) {
            state.user = {...state.user, isLogin: true, name: 'lzh'}
        },
        createPost(state, newPost) {
            state.posts.push(newPost)
        }
    },
    getters:{
        columnNumber(state) {
            return state.columns.length
        },
        getColumnById: state => (id: number) => state.columns.find(col => col.id === id),
        getPostsById: state => (cid: number) => state.posts.filter(post => post.columnId === cid)
    }
})

export default store
