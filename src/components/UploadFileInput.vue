<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="upload" v-bind="$attrs"
         :class="{bgtransparent: fileStatus === 'success'}">
      <slot v-if="fileStatus === 'uploading'" name="uploading" class="uploadStyle">
        <button class="btn btn-primary">正在上传...</button>
      </slot>
      <!--具名插槽+作用域插槽, 向父级暴露成功的信息-->
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <!--<slot v-else-if="fileStatus === 'error'" name="error">-->
      <!--  <button class="btn btn-danger">上传失败</button>-->
      <!--</slot>-->
      <slot v-else name="default" class="uploadStyle">
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
import {defineComponent, PropType, ref, watch} from "vue"
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
    },
    uploaded: {
      type: Object
    }
  },
  inheritAttrs: false,
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    // 如果传递过来的uploaded数据是存在的话，说明fileStatus已经是success状态
    const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
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

    // 处理CreatePost组件传递过来的uploaded数据
    // 说明此时是更新状态
    watch(() => props.uploaded, newValue => {
      if (newValue) {
        fileStatus.value = 'success'
        uploadedData.value = newValue
      }
    })
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
.file-upload-container {
  box-sizing: border-box;
  background-color: #6c757d;
  min-height: 200px;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  color: #f9f9f9;
}

.uploadStyle {
  padding: 3rem;
}

.bgtransparent {
  background: transparent;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
