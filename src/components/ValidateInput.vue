<template>
  <div class="validate-input-container pb-3">
    <input class="form-control"
           @blur="validateInput"
           v-model="inputRef.val"
           :class="{'is-invalid': inputRef.error}"
           v-bind="$attrs"
           v-if="tag !== 'textarea'"
    >
    <textarea name="" id="" cols="30" rows="10"
              v-else
              class="form-control"
              :class="{'is-invalid': inputRef.error}"
              v-model="inputRef.val"
              @blur="validateInput"
              v-bind="$attrs"
    ></textarea>
    <span class="invalid-feedback" v-if="inputRef.error">{{ inputRef.errorMessage }}</span>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, PropType, reactive} from "vue"

import {emitter} from "./ValidateForm.vue";

// Props类型接口
interface RuleProp {
  type: 'required' | 'email' | 'range' | 'custom'
  message: string
  min?: { message: string, length: number },
  validator?: () => boolean
}

export type RuleProps = RuleProp[]
export type TagType = 'input' | 'textarea'

export default defineComponent({
  name: "ValidateInput",
  props: {
    rules: Array as PropType<RuleProps>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },

  setup(props, context) {
    const inputRef = reactive({
      val: computed({ // 使用计算属性来解决问题
        get: () => props.modelValue || '',
        set: newValue => {
          context.emit('update:modelValue', newValue)
        }
      }),
      error: false,
      errorMessage: ''
    })

    // 验证Input
    const emailRegExp = /^[a-zA-Z\d.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)*$/
    const validateInput = () => {
      if (!props.rules) return true
      const isAllPassed = props.rules.every(rule => {
        let pass = true
        inputRef.errorMessage = rule.message
        switch (rule.type) {
          case "required":
            pass = inputRef.val.trim() !== ''
            break
          case 'email':
            pass = emailRegExp.test(inputRef.val)
            break
          case "range":
            if (rule.min) {
              pass = !inputRef.val.includes(' ') && inputRef.val.trim().length > rule.min.length
              inputRef.errorMessage = rule.min.message
            }
            break
          case "custom":
            pass = rule.validator ? rule.validator() : true
            break
          default:
            break
        }
        return pass
      })

      inputRef.error = !isAllPassed
      return isAllPassed
    }

    // 清空Input 这里只是简单的将val赋值为'', 如果是单选框那些要单独处理
    const clearValue = () => {
      inputRef.val = ''
    }

    // 创建组件的时候向父组件传递验证函数
    onMounted(() => {
      emitter.emit('form-item-create', validateInput)
      // emitter.emit('form-item-clear', clearValue)
    })

    return {
      inputRef,
      validateInput,
    }
  }
})
</script>

<style scoped>

</style>
