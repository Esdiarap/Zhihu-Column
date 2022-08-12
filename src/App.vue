<script lang="ts" setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader, {UserProps} from "./components/GlobalHeader.vue";
import PageFooter from "./components/PageFooter.vue";
import {useStore} from "vuex";
import {GlobalDataProps} from "./store";
import {computed} from "vue";
import LoaderMask from "./components/LoaderMask.vue";


const store = useStore<GlobalDataProps>()
const currentUser = computed(() => store.state.user)
const isLoading = computed(() => store.state.loading)

</script>

<template>
  <div class="container-fluid p-xl-0 flex-shrink-0">
    <GlobalHeader :user="currentUser"></GlobalHeader>
    <LoaderMask v-if="isLoading"></LoaderMask>
    <router-view></router-view>
    <PageFooter></PageFooter>
  </div>
</template>

<style scoped>

</style>
