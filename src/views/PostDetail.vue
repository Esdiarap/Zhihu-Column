<template>
  <div class="post-detail-container">
    <img :src="currentImageURL" alt="image" v-if="post.image" class="post-detail-img">
    <h2>{{post.title}}</h2>
    <div class="post-detail-nav">
      <div class="post-detail-author">
        <img :src="currentAvatarURL" alt="authorAvatar" v-if="currentAvatarURL">
        <div class="author">
          <p class="nickname">作者昵称: {{currentNickName}}</p>
          <p class="description">描述是: {{currentDescription}}</p>
        </div>
      </div>
      <span class="create-time">{{post.createdAt}}</span>
    </div>
    <div class="content" v-if="currentHTML" v-html="currentHTML"></div>
    <div class="bottom-button" v-if="showEditArea">
      <router-link :to="{name: 'create', query: {id: post._id}}" class="btn btn-primary">编辑</router-link>
      <button class="btn btn-danger" @click.prevent="isModalVisible = true">删除</button>
    </div>
    <ModalAlert :visible="isModalVisible"
                :title="'删除文章'"
                @modal-on-close="onClose"
                @modal-on-confirm="onConfirm"
    >
      <p style="color: #d95858">确定要删除文章吗?</p>
    </ModalAlert>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue"
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {ImageProps, PostProps, ResponseType, UserProps} from "../store";
import MarkdownIt from 'markdown-it'
import ModalAlert from "../components/ModalAlert.vue";
import createMessageAlert from "../apis/createMessageAlert";
import router from "../router";

export default defineComponent({
  name: "PostDetail",
  components: {ModalAlert},

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
    const currentImageURL = computed(() => {
      if (post.value && post.value.image) {
        const {image} = post.value
        return (image as ImageProps).url
      }
      return ''
    })
    const currentAvatarURL = computed(() => {
      if (post.value && post.value.author) {
        const {author} = post.value
        // return author as UserProps['avatar'] as ImageProps['url']
        return (author as UserProps).avatar?.url
      }
      return ''
    })
    const currentNickName = computed(() => {
      if (post.value && post.value.author) {
        const {author} = post.value
        return (author as UserProps).nickName
      }
      return ''
    })
    const currentDescription = computed(() => {
      if (post.value && post.value.author) {
        const {author} = post.value
        return (author as UserProps).description
      }
      return ''
    })
    onMounted(() => {
      store.dispatch('fetchPost', postId)
    })

    const showEditArea = computed(() => {
      const {isLogin, _id} = store.state.user
      if (post.value && post.value.author && isLogin) {
        const postAuthor = post.value.author as UserProps
        return postAuthor._id === _id
      }
      return false
    })

    // 删除对话框部分
    const isModalVisible = ref(false)
    const onClose = () => isModalVisible.value = false
    const onConfirm = () => {
      isModalVisible.value = false // 消除删除框
      store.dispatch('deletePost', postId).then((rawData: ResponseType<PostProps>) => {
        createMessageAlert('删除成功，2秒后跳转到专栏首页', 'success', 2000)
        setTimeout(() => {
          router.push({name: 'column', params: {id: rawData.data.column}})
        }, 2000)
      })
    }
    return {
      post,
      currentHTML,
      showEditArea,
      isModalVisible,
      onClose,
      onConfirm,
      currentImageURL,
      currentAvatarURL,
      currentNickName,
      currentDescription
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

.bottom-button {
  display: flex;
  gap: 1rem;
}
</style>
