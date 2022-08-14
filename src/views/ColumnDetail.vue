<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar?.url" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <PostList :list="list"></PostList>
    <button
        class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
        @click="loadMorePage"
        v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from "vue"
import {useRoute} from "vue-router";
import PostList from "../components/PostList.vue";
import {useStore} from "vuex";
import {GlobalDataProps} from "../store";
import useLoadMore from "../hooks/useLoadMore";

export default defineComponent({
  name: "ColumnDetail",
  components: {PostList},
  setup() {
    const route = useRoute()
    const currentId = route.params.id
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', {currentPage: 1, pageSize: 3, cid: currentId})
    })
    const column = computed(() => store.getters.getColumnById(currentId))
    const list = computed(() => store.getters.getPostsById(currentId))

    ///////////////////////////////
    // 加载更多
    const total = computed(() => store.state.posts.total)
    const {loadMorePage, isLastPage} = useLoadMore('fetchPosts', total, {
      pageSize: 3,
      currentPage: 2,
      columnId: currentId
    })
    return {
      column,
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style scoped>

</style>
