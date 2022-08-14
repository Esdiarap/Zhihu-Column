<template>
  <div class="create-post-page">
    <UploadFileInput action="/upload"
                     :before-upload="beforeUpload"
                     @file-uploaded="onFileUploaded"
                     :uploaded="uploadedData"
    >
      <template #default>
        <h2>点击上传头图</h2>
      </template>
      <!--正在上传-->
      <template #uploading>
        <!--显示上传旋转图标-->
        <div class="spinner-container">
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
          <span>正在上传头图...</span>
        </div>
      </template>
      <!--上传成功-->
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" alt="image" width="500">
      </template>
    </UploadFileInput>
    <h4>新建文章</h4>
    <validate-form @validateForm="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
            :rules="titleRules"
            v-model="titleVal"
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
import {defineComponent, onMounted, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import ValidateInput, {RuleProps} from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import {GlobalDataProps, ImageProps, PostProps, ResponseType} from "../store";
import UploadFileInput from "../components/UploadFileInput.vue";
import createMessageAlert from "../apis/createMessageAlert";
import uploadCheck from "../apis/uploadCheck";


export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput,
    ValidateForm,
    UploadFileInput
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore<GlobalDataProps>()

    const titleVal = ref('')
    const titleRules: RuleProps = [
      {type: 'required', message: '文章标题不能为空'}
    ]
    const contentVal = ref('')
    const contentRules: RuleProps = [
      {type: 'required', message: '文章详情不能为空'}
    ]
    let imageID: string

    // 验证
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const {column, _id} = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageID) {
            newPost.image = imageID
          }
          store.dispatch('createPost', newPost).then(() => {
            createMessageAlert('发表成功, 2秒后跳转到专栏', 'success', 2000)
            setTimeout(() => {
              router.push({name: 'column', params: {id: column}})
            }, 2000)
          })
        }
      }
    }


    const beforeUpload = (file: File) => {
      const result = uploadCheck(file, {format: ['image/jpeg', 'image/png'], size: 1})
      if (result.error === 'format') createMessageAlert('格式错误，只能是jpg和png', 'error', 2000)
      if (result.error === 'size') createMessageAlert('不能超过1MB', 'error', 2000)
      return result.passed
    }

    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      createMessageAlert(`上传图片的ID ${rawData.data._id}`, 'success', 2000)
      if (rawData.data._id) imageID = rawData.data._id
    }

    /////////////////////////////////
    // 处理修改Post的情况
    const isEditMode = !!route.query.id
    const uploadedData = ref()
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = {data: currentPost.image}
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,
      beforeUpload,
      onFileUploaded,
      uploadedData
    }
  }
})
</script>

<style scoped lang="scss">
.create-post-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;

  & > * {
    width: 75%;
  }
}

.spinner-container {
  display: flex;
  gap: 2rem;
}
</style>
