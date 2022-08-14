<template>
  <div class="vue-easymde-editor">
    <textarea ref="textArea"></textarea>
  </div>
</template>

<script lang="ts" setup>
import EasyMDE, {Options} from "easymde";
import {onMounted, onUnmounted, ref} from "vue";

// 类型 属性以及事件
interface EditorProps {
  modelValue?: string
  options?: Options
}
interface EditorEvents {
  (type: 'update:modelValue', value: string): void
  (type: 'change', value: string): void
  (type: 'blur'): void
}

const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEvents>()
// 初始化数据
const textArea = ref<null | HTMLTextAreaElement>(null)
let easyMDEInstance: EasyMDE | null = null// 实例
const innerValue = ref(props.modelValue || '')
onMounted(() => {
  if (textArea.value) {
    // 组装options
    const config: Options = {
      ...props.options || {},
      element: textArea.value,
      initialValue: innerValue.value
    }
    easyMDEInstance = new EasyMDE(config)

    // 监视事件
    easyMDEInstance.codemirror.on('change', () => {
      if (easyMDEInstance) {
        // 拿到当前的值
        const updatedvalue = easyMDEInstance.value()
        innerValue.value = updatedvalue
        emit('update:modelValue', updatedvalue)
        emit('change', updatedvalue)
      }
    })
    easyMDEInstance.codemirror.on('blur', () => {
      if (easyMDEInstance) emit('blur')
    })
  }
})

// 销毁实例
onUnmounted(() => {
  if (easyMDEInstance) easyMDEInstance.cleanup()
  easyMDEInstance = null
})

// 1. 暴露相应的方法
// 方法: Clear 清空
const clear = () => {
  if (easyMDEInstance) easyMDEInstance.value('') // 重新赋值
}
// 方法: getMDEInstance 获取MDE实例
const getMDEInstance = () => easyMDEInstance
// 使用defineExpose编译器宏导出组件的内容
defineExpose({
  clear,
  getMDEInstance
})

// 2. 结合页面实现验证功能
</script>

<style scoped>

</style>
