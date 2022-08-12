<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <validate-form @validateForm="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
            :rules="titleRules" v-model="titleVal"
            placeholder="请输入文章标题"
            type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
            rows="10"
            type="text"
            tag="textarea"
            placeholder="请输入文章详情"
            :rules="contentRules"
            v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">创建</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import ValidateInput, {RuleProps} from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import {GlobalDataProps, PostProps} from "../store";


export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup() {
    const titleVal = ref('')
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const titleRules: RuleProps = [
      {type: 'required', message: '文章标题不能为空'}
    ]
    const contentVal = ref('')
    const contentRules: RuleProps = [
      {type: 'required', message: '文章详情不能为空'}
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const {columnId} = store.state.user
        if (columnId) {
          const newPost: PostProps = {
            _id: new Date().getTime().toString(),
            title: titleVal.value,
            content: contentVal.value,
            createdAt: new Date().toLocaleString(),
            column: columnId.toString()
          }
          store.commit('createPost', newPost)
          router.push({name: 'column', params: {id: columnId}})
        }
      }
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit
    }
  }
})
</script>
