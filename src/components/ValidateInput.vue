<template>
  <div class="validate-input-container pb-3">
    <input class="form-control"
           @blur="validateInput"
           :value="inputRef.val"
           @input="updateValue"
           :class="{'is-invalid': inputRef.error}"
           v-bind="$attrs"
    >
    <span class="invalid-feedback" v-if="inputRef.error">{{ inputRef.errorMessage }}</span>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive} from "vue"

interface RuleProp {
  type: 'required' | 'email' | 'range'
  message: string
  min?: { message: string, length: number }
}

export type RuleProps = RuleProp[]

export default defineComponent({
  name: "ValidateInput",
  props: {
    rules: Array as PropType<RuleProps>,
    modelValue: String
  },

  setup(props, context) {
    const inputRef = reactive({
      val: props.modelValue || '', // 先提取props中的modelValue默认值
      error: false,
      errorMessage: ''
    })

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
          default:
            break
        }
        return pass
      })

      inputRef.error = !isAllPassed
    }

    const updateValue = (e: KeyboardEvent) => {
      const el = e.target as HTMLInputElement
      inputRef.val = el.value
      context.emit('update:modelValue', inputRef.val) // 触发update:modelValue自定义函数给父组件
    }
    return {
      inputRef,
      validateInput,
      updateValue
    }
  }
})
</script>

<style scoped>

</style>
