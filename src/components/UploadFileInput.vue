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
import {defineComponent, PropType, ref} from "vue"
import axios from "axios";

type UploadStatus = 'ready' | 'uploading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean

export default defineComponent({
  name: "UploadFileInput",
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    }
  },
  emits: ['file-uploaded', 'file-uploaded-error'],
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
        const files = Array.from(currentTarget.files)
        // 在loading之前检查上传的文件是否符合用户需求
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) return
        }

        // 上传
        fileStatus.value = 'uploading'
        const formData = new FormData()
        formData.append('file', files[0])

        // 发送请求
        axios.post(props.action, formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }).then(res => {
          fileStatus.value = 'success'
          // 成功之后发射自定义事件
          context.emit('file-uploaded', res.data)
        }).catch(e => {
          fileStatus.value = 'error'
          // 失败之后发射自定义事件
          context.emit('file-uploaded-error', e)
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
