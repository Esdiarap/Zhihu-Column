# 第六章 请你吃全家桶 - 初步使用 vue-router 和 vuex

## [#](http://docs.vikingship.xyz/vuerouter-vuex.html#_6-1-什么是-spa-应用)6-1 什么是 SPA 应用？

**HTML5 History API： https://developer.mozilla.org/zh-CN/docs/Web/API/History_API**

这个 API 帮助我们可以在不刷新页面的前提下动态改变浏览器地址栏中的 URL 地址，动态修改页面上所显示资源。

** history.pushState (state, title, url) 方法 ：添加一条历史记录，不刷新页面参数 **

- state : 一个于指定网址相关的状态对象，popstate 事件触发时，该对象会传入回调函数中。如果不需要这个对象，此处可以填 null。
- title : 新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填 null。
- url : 新的网址，必须与前页面处在同一个域。浏览器的地址栏将显示这个网址。

使用 history API 做的小例子地址： https://codesandbox.io/s/gallant-newton-kl9hj?file=/src/index.js

```javascript
const handleChange = (url, content) => {
  // go to url
  window.history.pushState(null, "hello there", url);

  // new data
  document.getElementById("app").innerHTML = `
    <h1>${content}</h1>
  `;
};
document.getElementById("change").addEventListener("click", e => {
  e.preventDefault();
  handleChange("create.html", "create");
});

document.getElementById("home").addEventListener("click", e => {
  e.preventDefault();
  handleChange("/", "home");
});
```

### [#](http://docs.vikingship.xyz/vuerouter-vuex.html#spa-的优点)SPA 的优点

- 速度快，第一次下载完成静态文件，跳转不需要再次下载静态文件
- 体验好，整个交互趋于无缝，更倾向于原生应用
- 为前后端分离提供了实践场所

## [#](http://docs.vikingship.xyz/vuerouter-vuex.html#_6-2-vue-router-的安装和使用)6-2 Vue Router 的安装和使用

### [#](http://docs.vikingship.xyz/vuerouter-vuex.html#安装新版的-vue-router)安装新版的 vue router

```bash
npm install vue-router@next

// 保证安装完毕的版本是 4.0.0 以上的
```

vue-router-next 的项目地址： https://github.com/vuejs/vue-router-next

## [#](http://docs.vikingship.xyz/vuerouter-vuex.html#_6-3-vue-router-添加路由)6-3 vue-router 添加路由

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
```

## [#](http://docs.vikingship.xyz/vuerouter-vuex.html#_6-4-使用-vue-router-获取参数和跳转路由)6-4 使用 vue-router 获取参数和跳转路由

Node.js URL 结构表地址：https://nodejs.org/api/url.html#url_url_strings_and_url_objects

```javascript
import { useRoute } from 'vue-router'
// 它是一个函数，调用后可以返回对应的对象。
const route = useRoute() 
// 我们返回出去，在页面中把它全部显示出来看看
return {
 route
}
// 对于一个object，如果我们想再页面显示它的全部内容，除了在 js 中使用 console，也可以使用 pre 标签包裹这个变量。
// pre 标签可定义预格式化的文本。在pre元素中的文本会保留空格和换行符。文本显现为等宽字体
<pre>{{route}}</pre>

// 替换 URL 为比较丰富的地址
http://localhost:8080/column?abc=foo#123
```

**router-link 组件跳转的方式**

我们第一种方法可以将 to 改成不是字符串类型，而是 object 类型，这个 object 应该有你要前往 route 的 name ，还有对应的 params。

```javascript
 :to="{ name: 'column', params: { id: column.id }}"
```

第二种格式，我们可以在里面传递一个模版字符串，这里面把 column.id 填充进去就好。

```javascript
 :to="`/column/${column.id}`"
```

**使用 useRouter 钩子函数进行跳转**

```javascript
const router = useRouter()
// 特别注意这个是 useRouter 而不是 useRoute，差一个字母，作用千差万别，那个是获得路由信息，这个是定义路由的一系列行为。在这里，我们可以掉用
router.push('/login') 

// router.push 方法跳转到另外一个 url，它接受的参数和 router-link 的 to 里面的参数是完全一致的，其实router link 内部和这个 router 分享的是一段代码，可谓是殊途同归了。
```

## [#](http://docs.vikingship.xyz/vuerouter-vuex.html#_6-6-什么是状态管理工具)6-6 什么是状态管理工具

### [#](http://docs.vikingship.xyz/vuerouter-vuex.html#直接使用全局对象的问题)直接使用全局对象的问题

- 第一，全局对象里面的数据是普通的 javascript 数据类型，他们不是响应式的，也就说第一次读取渲染有可能没有问题，但是当数据修改以后，界面没法作出对应的更新，这是一个很大的问题。
- 第二，全局对象的修改无法追踪，也就是说在应用中的任何一处代码，都可以有机会拿到全局数据，并作出对应的修改，但是我们根本没有办法搞清楚是哪行代码 哪个文件修改了全局数据，这样就非常容易产生 bug 而且难以追踪。这就很危险了。
- 第三，vue 是组件化的世界，就像我们的程序大家也可以发现，组件的构成就像一棵树一样，全局数据一般是从父组件一层层的传递给子组件的。直接从一个组件获取数据被视为一种反模式，这样很容易造成数据的混乱。

### [#](http://docs.vikingship.xyz/vuerouter-vuex.html#状态管理三杰)状态管理三杰

- Vuex ：https://vuex.vuejs.org/zh/guide/
- Redux ：https://redux.js.org/
- Mobx ：https://mobx.js.org/README.html

### [#](http://docs.vikingship.xyz/vuerouter-vuex.html#设计理念)设计理念

- 一个类似 object 的全局数据结构 - 称之为 store
- 只能调用特定的方法完成数据的修改

## [#](http://docs.vikingship.xyz/vuerouter-vuex.html#_6-7-vuex-简介和安装)6-7 Vuex 简介和安装

**每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。** Vuex 和单纯的全局对象有以下两点不同：

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

### [#](http://docs.vikingship.xyz/vuerouter-vuex.html#新版-vuex-安装)新版 Vuex 安装

```bash
npm install vuex@next --save

// 保证安装完毕的版本是 4.0.0 以上的
```

### [#](http://docs.vikingship.xyz/vuerouter-vuex.html#测试-vuex-store)测试 Vuex store

```typescript
import { createStore } from 'vuex'
// 从 vuex 导入 createStore 这个函数，我们发现 vue3 以后，这些第三方的官方库，名字出奇的相似，vue-router 也是以create 开头的，看起来非常的清楚。
const store = createStore({
  state: {
    count: 0
  },  
})
// createStore 接受一个对象作为参数，这些对象中包含了 vuex 的核型概念，第一个概念称之为 state，这里面包含的是我们想放入的在全局共享的数据，这里我们放入一个简单的 count。

// 现在我们已经可以直接访问这个值了，我们可以直接使用 store.state.count 来访问它。

console.log('store', store.state.count)
// 接下来我们来更改状态，更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：
  mutations: {
    add (state) {
      state.count++
    }
  }
  
// 有了 mutations 以后，让我们来触发它，要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：
store.commit('add')
console.log('count', store.state.count)
```

## [#](http://docs.vikingship.xyz/vuerouter-vuex.html#_6-8-vuex-整合当前应用)6-8 Vuex 整合当前应用

**定义 store 文件**

```typescript
import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from './testData'
interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}
export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: { isLogin: false }
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'viking' }
    }
  }
})

export default store
```

**使用**

```typescript
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'

...
const store = useStore<GlobalDataProps>()
const list = computed(() => store.state.columns)
```

## [#](http://docs.vikingship.xyz/vuerouter-vuex.html#_6-9-vuex-getters)6-9 Vuex getters

vuex getters 文档 ：https://vuex.vuejs.org/zh/guide/getters.html

Vuex 允许我们在 store 中定义 “getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

```typescript
getters: {
  biggerColumnsLen(state) {
    return state.columns.filter(c => c.id > 2).length
  }
}
// 定义完毕，就可以在应用中使用这个 getter 了
// Getter 会暴露为 store.getters 对象，你可以以属性的形式访问这些值：
const biggerColumnsLen =computed(()=>store.getters.biggerColumnsLen)
getColumnById: (state) => (id: number) => {
  return state.columns.find(c => c.id === id)
},
getPostsByCid: (state) => (id: number) => {
  return state.posts.filter(post => post.columnId === id)
}
// 定义完毕以后就可以在应用中使用 getter 快速的拿到这两个值了
const column = computed(() => store.getters.getColumnById(currentId))
const list = computed(() => store.getters.getPostsByCid(currentId))
```

## [#](http://docs.vikingship.xyz/vuerouter-vuex.html#_6-11-添加导航守卫)6-11 添加导航守卫

vue-router 导航守卫文档 ：https://router.vuejs.org/zh/guide/advanced/navigation-guards.html

```typescript
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !store.state.user.isLogin) {
    next({ name: 'login' })
  } else {
    next()
  }
})
```

## [#](http://docs.vikingship.xyz/vuerouter-vuex.html#_6-12-添加元信息完成权限管理)6-12 添加元信息完成权限管理

vue-router 元信息文档 ：https://router.vuejs.org/zh/guide/advanced/meta.html

**添加元信息**

```typescript
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
```

**更新路由守卫**

```typescript
router.beforeEach((to, from, next) => {
  console.log(to.meta)
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({ name: 'login' })
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/')
  } else {
    next()
  }
})
```