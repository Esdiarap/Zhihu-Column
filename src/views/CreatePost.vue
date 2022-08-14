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
    <h4>{{isEditMode ? '更新文章' : '新建文章'}}</h4>
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
      <div class="mb-3 markdown-editor-container">
        <label class="form-label">文章详情：</label>
        <MarkdownEditor
            v-model="contentVal"
            ref="MDERef"
            @blur="checkEditor"
            :class="{'is-invalid': !editorStatus.isValid}"
        ></MarkdownEditor>
        <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{editorStatus.message}}</span>
        <!--<validate-input-->
        <!--    rows="10"-->
        <!--    type="text"-->
        <!--    tag="textarea"-->
        <!--    placeholder="请输入文章详情"-->
        <!--    :rules="contentRules"-->
        <!--    v-model="contentVal"-->
        <!--/>-->
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{isEditMode ? '更新文章' : '发表文章'}}</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import ValidateInput, {RuleProps} from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import {GlobalDataProps, ImageProps, PostProps, ResponseType} from "../store";
import UploadFileInput from "../components/UploadFileInput.vue";
import createMessageAlert from "../apis/createMessageAlert";
import uploadCheck from "../apis/uploadCheck";
import MarkdownEditor from '../components/MarkdownEditor.vue'
import EasyMDE from "easymde";

// 自己制作的EasyMDE组件暴露出来的方法
interface MarkdownExpose {
  clear: () => void
  getMDEInstance: () => EasyMDE
}

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput,
    ValidateForm,
    UploadFileInput,
    MarkdownEditor
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
    let imageID: string

    // 验证
    const onFormSubmit = (result: boolean) => {
      checkEditor()
      if (result && editorStatus.isValid) {
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
          // 是否是更新
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {id: route.query.id, payload: newPost} : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessageAlert(isEditMode ? '更新成功,2秒后跳转' : '发表成功,2秒后跳转', 'success', 2000)
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

    ///////////////////////////////
    // EasyMDE的实例
    const MDERef = ref<null | MarkdownExpose>(null)
    onMounted(() => {
      if (MDERef.value) {
        // console.log(MDERef.value)
        // console.log(MDERef.value.getMDEInstance())
      }
    })
    // 检验Editor
    const editorStatus = reactive({
      isValid: true,
      message: ''
    })
    const checkEditor = () => {
      if (contentVal.value.trim() === '') {
        editorStatus.isValid = false
        editorStatus.message = '文章内容不能为空'
      }else {
        editorStatus.isValid = true
        editorStatus.message = ''
      }
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      onFormSubmit,
      beforeUpload,
      onFileUploaded,
      uploadedData,
      isEditMode,
      MDERef,
      editorStatus,
      checkEditor
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

.markdown-editor-container {
  .is-invalid {
    outline: 1px solid red;
  }
}
</style>
