<script lang="ts" setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader, {UserProps} from "./components/GlobalHeader.vue";
import HomePage from "./views/HomePage.vue";
import LoginPage from "./views/LoginPage.vue";

const currentUser: UserProps = {
  isLogin: true,
  name: 'lzh'
}

</script>

<template>
  <div class="container-fluid p-xl-0 flex-shrink-0">
    <GlobalHeader :user="currentUser"></GlobalHeader>
    <HomePage></HomePage>
    <LoginPage></LoginPage>
  </div>
</template>

<style scoped>

</style>
