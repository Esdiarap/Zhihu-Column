<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img :src="column?.avatar?.url" :alt="column.title" class="rounded-circle border border-light my-3">
          <h5 class="card-title">{{column.title}}</h5>
          <p class="card-text">{{column.description}}</p>
          <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import {ColumnProps} from "../store";

export default defineComponent({
  name: 'ColumnList',
  props: {
    lists: {
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  setup(props) {
    const columnList = computed(() => props.lists.map(column => {
      if (!column.avatar) {
        // 这里不知道怎么把照片转成string，其实就是一个地址而已。。
        // const jpg = await import('../assets/skadi.jpg')
      }
      return column
    }))
    return {
      columnList
    }
  }
})
</script>


<style scoped>
.card-body img {
  height: 50px;
  width: 50px;
}
</style>


