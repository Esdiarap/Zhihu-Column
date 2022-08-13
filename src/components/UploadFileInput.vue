<template>
  <div class="file-upload">
    <button class="btn btn-primary" @click.prevent="upload">
      <span v-if="fileStatus === 'uploading'">正在上传...</span>
      <span v-else-if="fileStatus === 'success'">上传成功</span>
      <span v-else-if="fileStatus === 'error'">上传失败</span>
      <span v-else>点击上传</span>
    </button>
    <input
        type="file"
        class="file-input d-none"
        ref="fileInput"
        @change="handleFileChange"
    >
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue"
import axios from "axios";

type UploadStatus = 'ready' | 'uploading' | 'success' | 'error'

export default defineComponent({
  name: "UploadFileInput",
  props: {
    action: {
      type: String,
      required: true
    }
  },
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>('ready')
    const upload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) { // 文件存在
        fileStatus.value = 'uploading'
        const files = Array.from(currentTarget.files)
        const formData = new FormData()
        formData.append('file', files[0])

        // 发送请求
        axios.post(props.action, formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }).then(res => {
          console.log(res.data)
          fileStatus.value = 'success'
        }).catch(e => {
          fileStatus.value = 'error'
        }).finally(() => {
          // fileStatus.value = 'ready'
          if (fileInput.value) { // 把输入文件的框清空
            fileInput.value.value = ''
          }
        })

      }
    }
    return {
      upload,
      fileInput,
      fileStatus,
      handleFileChange
    }
  }
})
</script>

<style scoped>

</style>
