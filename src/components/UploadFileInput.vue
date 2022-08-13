<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="upload">
      <slot v-if="fileStatus === 'uploading'" name="uploading">
        <button class="btn btn-primary">正在上传...</button>
      </slot>
      <!--具名插槽+作用域插槽, 向父级暴露成功的信息-->
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <!--<slot v-else-if="fileStatus === 'error'" name="error">-->
      <!--  <button class="btn btn-danger">上传失败</button>-->
      <!--</slot>-->
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
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
    const uploadedData = ref()
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
          // 并且把数据暴露给作用域插槽，向父级传递
          uploadedData.value = res.data
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
      handleFileChange,
      uploadedData
    }
  }
})
</script>

<style scoped>

</style>
