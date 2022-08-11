<template>
  <ul>
    <li v-for="column in lists" :key="column.id">
      <img :src="column.avatar" :alt="column.title">
      <h5>{{column.title}}</h5>
      <p>{{column.description}}</p>
      <a href="#">进入专栏</a>
    </li>
  </ul>
</template>

<script lang="ts">
import {PropType} from "vue";
// 暴露接口
export interface ColumnProps {
  id: number,
  title: string,
  avatar: string,
  description: string
}

export default {
  name: 'ColumnList',
  props: {
    lists: {
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },

}
</script>


<style scoped>

</style>


