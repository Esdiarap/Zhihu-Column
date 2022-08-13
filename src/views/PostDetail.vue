<template>
  <div class="post-detail-container">
    <img :src="post.image?.url" alt="image" v-if="post?.image" class="post-detail-img">
    <h2>{{post?.title}}</h2>
    <div class="post-detail-nav">
      <div class="post-detail-author">
        <img :src="post?.author?.avatar?.url" alt="authorAvatar" v-if="post?.author?.avatar">
        <div class="author">
          <p class="nickname">作者昵称: {{post?.author.nickname}}</p>
          <p class="description">描述是: {{post?.author.description}}</p>
        </div>
      </div>
      <span class="create-time">{{post?.createdAt}}</span>
    </div>
    <div class="content" v-if="currentHTML" v-html="currentHTML"></div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue"
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {PostProps} from "../store";
import MarkdownIt from 'markdown-it'

export default defineComponent({
  name: "PostDetail",
  setup() {
    const store = useStore()
    const route = useRoute()
    const postId = route.params.id
    const md = new MarkdownIt()
    const currentHTML = computed(() => {
      if (post.value && post.value.content) {
        const {isHTML, content} = post.value
        return isHTML ? content : md.render(content)
      }
      return ''
    })

    const post = computed<PostProps>(() => store.getters.getPostById(postId))
    onMounted(() => {
      store.dispatch('fetchPost', postId)
    })
    return {
      post,
      currentHTML
    }
  }
})
</script>

<style scoped lang="scss">
p {
  padding: 0;
  margin: 0;
}
.post-detail-container {
  width: 75%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-detail-img {
  align-items: center;
  height: 200px;
  width: 100%;
  object-fit: contain;
}

.post-detail-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-detail-author {
  display: flex;
  column-gap: 20px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  .author {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
}

.nickname {
  font-size: 1.2rem;
  font-weight: bold;
}

.description {
  color: rgb(126, 119, 119);
}
</style>
