<template>
  <div class="post-list">
    <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4 @click.prevent="routeToPostDetail(post._id)" class="link-primary link">{{ post.title }}</h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-3">
            <img :src="post.image instanceof Object ? post.image.url : ''" :alt="post.title" class="rounded-lg w-100">
          </div>
          <p :class="{'col-9': post.image}">{{ post.excerpt }}</p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {PostProps} from '../store'
import router from "../router";

export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>
    }
  },
  setup() {
    const routeToPostDetail = (_id: string | undefined) => {
      if (_id){
        router.push(`/posts/${_id}`)
      }
    }
    return {
      routeToPostDetail
    }
  }
})
</script>

<style scoped lang="scss">
.link {
  text-decoration: underline;
  letter-spacing: 2px;
}
</style>
