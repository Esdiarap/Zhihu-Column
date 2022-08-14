<template>
  <nav class="navbar-dark bg-primary justify-content-between mb-4 px-4">
    <div class="w-75 mx-auto navbar">
      <router-link to="/" class="navbar-brand">专栏</router-link>
      <ul v-if="!user.isLogin" class="list-inline mb-0">
        <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
        <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
      </ul>
      <ul v-else class="list-inline mb-0">
        <!--<li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">你好 {{user.name}}</a></li>-->
        <DropdownMenu :title="`${user.nickName}`">
          <DropdownItem><router-link to="/create" class="dropdown-item">新建文章</router-link></DropdownItem>
          <DropdownItem><a href="#" class="dropdown-item">编辑资料</a></DropdownItem>
          <DropdownItem><a href="#" class="dropdown-item" @click.prevent="logout">退出登录</a></DropdownItem>
        </DropdownMenu>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import DropdownMenu from "./DropdownMenu.vue";
import DropdownItem from "./DropdownItem.vue";
import {UserProps} from "../store";
import {useStore} from "vuex";
import createMessageAlert from "../apis/createMessageAlert";


export default defineComponent({
  name: "GlobalHeader",
  components: {DropdownMenu, DropdownItem},

  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const store = useStore()
    const logout = () => {
      createMessageAlert('退出成功', 'success', 2000)
      store.commit('logout')
    }
    return {
      logout
    }
  }
})
</script>

<style scoped>

</style>
