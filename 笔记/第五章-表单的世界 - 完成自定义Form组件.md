# 第五章 表单的世界 - 完成自定义 Form 组件

## [#](http://docs.vikingship.xyz/validate-form.html#_5-1-web-世界的经典元素-表单)5-1 web 世界的经典元素 - 表单

**需求分析** ![表单组件的序曲分析](http://docs.vikingship.xyz/assets/img/form1.b96476f2.png)

## [#](http://docs.vikingship.xyz/validate-form.html#_5-2-validateinput-编码第一部分-简单的实现)5-2 ValidateInput 编码第一部分 - 简单的实现

**Bootstrap Form 文档地址： https://v5.getbootstrap.com/docs/5.0/forms/overview/**

```html
  <form action="">
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">邮箱地址</label>
      <input
        type="text" class="form-control" id="exampleInputEmail1"
        v-model="emailRef.val"
        @blur="validateEmail"
      >
      <div class="form-text" v-if="emailRef.error">{{emailRef.message}}</div>
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">密码</label>
      <input type="password" class="form-control" id="exampleInputPassword1">
    </div>
  </form>
```

验证表单的逻辑处理，现在有两个规则，不能为空，和需要是邮件地址

```javascript
const emailRef = reactive({
  val: '',
  error: false,
  message: ''
})
const validateEmail = () => {
  if (emailRef.val.trim() === '') {
    emailRef.error = true
    emailRef.message = 'can not be empty'
  } else if (!emailReg.test(emailRef.val)) {
    emailRef.error = true
    emailRef.message = 'should be valid email'
  }
}

return {
  emailRef,
  validateEmail
}
```

## [#](http://docs.vikingship.xyz/validate-form.html#_5-3-validateinput-编码第二部分-抽象验证规则)5-3 ValidateInput 编码第二部分 - 抽象验证规则

ValidateInput 编码

```vue
<template>
  <div class="validate-input-container pb-3">
    <input type="text"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      @blur="validateInput"
    >
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from 'vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProp {
  type: 'required' | 'email';
  message: string;
}
export type RulesProp = RuleProp[]
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>
  },
  setup(props) {
    const inputRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
      }
    }
    return {
      inputRef,
      validateInput
    }
  }
})
</script>
```

使用

```html
<div class="mb-3">
  <label class="form-label">邮箱地址</label>
  <validate-input :rules="emailRules"></validate-input>
</div>
const emailRules: RulesProp = [
  { type: 'required', message: '电子邮箱地址不能为空' },
  { type: 'email', message: '请输入正确的电子邮箱格式' }
]
```

## [#](http://docs.vikingship.xyz/validate-form.html#_5-4-validateinput-编码第三部分-支持-v-model)5-4 ValidateInput 编码第三部分 - 支持 v-model

WARNING

这是一个 breaking change！ **Vue3 v-model 文档地址： https://v3.vuejs.org/guide/migration/v-model.html#overview**

```vue
<template>
  <div class="validate-input-container pb-3">
    <input type="text"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      // v-model='inputRef.val' 这里不能直接用v-model了，不然父组件收不到
      :value="inputRef.val" // 这里
      @blur="validateInput"
      @input="updateValue" // 这里，input事件发生的时候要emit一个自定义事件给父组件用
    >
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>
<script lang="ts">
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String
  },
  const inputRef = reactive({
    val: props.modelValue || '',
    error: false,
    message: ''
  })
  const updateValue = (e: KeyboardEvent) => {
    const targetValue = (e.target as HTMLInputElement).value
    inputRef.val = targetValue
    context.emit('update:modelValue', targetValue)
  }

</script>
```

## [#](http://docs.vikingship.xyz/validate-form.html#_5-5-validateinput-编码第四部分-使用-attrs-支持默认属性)5-5 ValidateInput 编码第四部分 - 使用 $attrs 支持默认属性

**Vue3 $attrs 文档地址： https://v3.vuejs.org/api/instance-properties.html#attrs**

## [#](http://docs.vikingship.xyz/validate-form.html#_5-6-validateform-组件需求分析)5-6 ValidateForm 组件需求分析

**需求分析** ![表单组件的序曲分析](http://docs.vikingship.xyz/assets/img/form2.ea475c4d.png)

## [#](http://docs.vikingship.xyz/validate-form.html#_5-7-validateform-编码第一部分-使用插槽-slot)5-7 ValidateForm 编码第一部分 - 使用插槽 slot

**Vue3 具名插槽 Named Slots 文档地址： https://v3.vuejs.org/guide/component-slots.html#named-slots**

ValidateForm.vue

```vue
<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['form-submit'],
  setup(props, context) {
    const submitForm = () => {
      context.emit('form-submit', true)
    }
    return {
      submitForm
    }
  }
})
</script>
```

## [#](http://docs.vikingship.xyz/validate-form.html#_5-9-validateform-编码第三部分-寻找外援-mitt-和-5-10-validateform-编码第四部分-大功告成)5-9 ValidateForm 编码第三部分 - 寻找外援 mitt 和 5-10 ValidateForm 编码第四部分 - 大功告成

**事件监听器 mitt 文档地址： https://github.com/developit/mitt**

安装 mitt

```bash
npm install mitt --save
```

**ValidateForm.vue**

```javascript
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
// 实例化 mitt
export const emitter = mitt()
export default defineComponent({
  emits: ['form-submit'],
  setup(props, context) {
    let funcArr: ValidateFunc[] = []
    const submitForm = () => {
      // 循环执行数组 得到最后的验证结果
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
    }
    // 将监听得到的验证函数都存到一个数组中
    const callback = (func: ValidateFunc) => {
      funcArr.push(func)
    }
    // 添加监听
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      // 删除监听
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
```

**ValidateInput.vue**

```javascript
// 将事件发射出去，其实就是把验证函数发射出去
onMounted(() => {
  emitter.emit('form-item-created', validateInput)
})
```