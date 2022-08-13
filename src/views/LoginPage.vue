<template>
  <div class="login-page mx-auto p-3 w-330">
    <validate-form @validateForm="validateForm">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
            :rules="emailRules" v-model="emailVal"
            placeholder="请输入邮箱地址"
            type="text"
            ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
            type="password"
            placeholder="请输入密码"
            :rules="passwordRules"
            v-model="passwordVal"
        />
      </div>
    </validate-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import ValidateInput, {RuleProps} from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {GlobalDataProps} from "../store";
import createMessageAlert from "../apis/createMessageAlert";

interface LoginPayload {
  email: string,
  password: string
}

export default defineComponent({
  name: 'LoginPage',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup() {
    const emailVal = ref('')
    const store = useStore<GlobalDataProps>()
    const emailRules: RuleProps = [
      {type: 'required', message: '电子邮箱地址不能为空'},
      {type: 'email', message: '请输入正确的电子邮箱格式'}
    ]
    const passwordVal = ref('')
    const passwordRules: RuleProps = [
      {type: 'required', message: '密码不能为空'}
    ]
    // 验证表单
    const router = useRouter()
    const validateForm = (result: boolean) => {
      if (result) {
        const payload: LoginPayload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        // store.dispatch('login', payload).then(res => {
        //   console.log(res)
        //   router.push('/')
        // })
        store.dispatch('loginAndFetchCurrentUser', payload).then(_ => {
          createMessageAlert('成功登录，2秒后跳转首页', 'success')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    return {
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      validateForm
    }
  }
})
</script>
