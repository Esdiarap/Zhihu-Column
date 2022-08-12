<template>
  <form class="validate-form-container" @submit.prevent="validateForm">
    <slot></slot>
    <slot name="submit">
      <button type="submit" class="btn btn-primary">Click me to Submit</button>
    </slot>
  </form>
</template>

<script lang="ts">
import {defineComponent, onUnmounted} from "vue"

import mitt from "mitt";
type FormItemCheckFunction = () => boolean
type FormItemClearFunction = () => void
type Events = {
  'form-item-create': FormItemCheckFunction
  'form-item-clear': FormItemClearFunction
}

export const emitter = mitt<Events>()

export default defineComponent({
  name: "ValidateForm",
  emits: ['validateForm'],
  setup(props, context) {

    //////////////////////////////////////
    // 处理Input组件发来的信息
    let funcArr: FormItemCheckFunction[] = []
    let clearFuncArr: FormItemClearFunction[] = []
    const handler = (func: FormItemCheckFunction) => {
      funcArr.push(func)
    }
    const clearHandler = (func: FormItemClearFunction) => {
      clearFuncArr.push(func)
    }
    emitter.on('form-item-create', handler) // 事件监听
    emitter.on('form-item-clear', clearHandler) // 清空item事件监听
    onUnmounted(() => {
      emitter.off('form-item-create', handler)
      funcArr = [] // 清空数组
      clearFuncArr = [] // 清空数据
    })
    // 验证表单
    const validateForm = () => {
      if (funcArr.length) { // 如果里面有函数的话，就执行
        const res = funcArr.map(func => func()).every(resBoolean => resBoolean)
        clearFuncArr.forEach(func => func())
        context.emit('validateForm', res)
      }
    }

    return {
      validateForm
    }
  }
})
</script>

<style scoped>

</style>
