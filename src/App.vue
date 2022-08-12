<script lang="ts" setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from "./components/GlobalHeader.vue";
import PageFooter from "./components/PageFooter.vue";
import {useStore} from "vuex";
import {GlobalDataProps} from "./store";
import {computed, onMounted} from "vue";
import LoaderMask from "./components/LoaderMask.vue";
import axios from "axios";


const store = useStore<GlobalDataProps>()
const currentUser = computed(() => store.state.user)
const isLoading = computed(() => store.state.loading)
const token = computed(() => store.state.token)
const error = computed(() => store.state.error)
onMounted(() => {
  if (!currentUser.value.isLogin && token.value) { // 用户没登录而且token有值
    axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
    store.dispatch('fetchCurrentUser')
  }
})
</script>

<template>
  <div class="container-fluid p-xl-0 flex-shrink-0">
    <GlobalHeader :user="currentUser"></GlobalHeader>
    <h1>{{error.message}}</h1>
    <LoaderMask v-if="isLoading"></LoaderMask>
    <router-view></router-view>
    <PageFooter></PageFooter>
  </div>
</template>

<style scoped>

</style>
