<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2" @click.prevent>开始写文章</a>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <ColumnList :lists="list"></ColumnList>
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
import {computed, defineComponent, onMounted} from 'vue'
import ColumnList from '../components/ColumnList.vue'
import {useStore} from "vuex";
import {GlobalDataProps} from "../store";
import useLoadMore from "../hooks/useLoadMore";

export default defineComponent({
  name: 'HomePage',
  components: {
    ColumnList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const list = computed(() => store.getters.getColumns)
    onMounted(() => {
      store.dispatch('fetchColumns', {pageSize: 3})
    })

    ///////////////////////////////////////////
    // 加载更多
    const total = computed(() => store.state.columns.total)
    const currentPage = computed(() => store.state.columns.currentPage)
    const {loadMorePage, isLastPage} = useLoadMore('fetchColumns', total, {
      pageSize: 3,
      currentPage: currentPage.value ? currentPage.value + 1 : 2 // 如果store中的currentPage是0，则点击加载第二页。如果有值，则加载下一页
    })
    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style lang="scss" scoped>
.btn-block {
  display: block;
}
</style>
