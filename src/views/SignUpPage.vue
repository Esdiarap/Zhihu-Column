<template>
  <div class="signup-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册者也账户</h5>
    <validate-form @validateForm="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
            :rules="emailRules" v-model="formData.emailVal"
            placeholder="请输入邮箱地址"
            type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
            :rules="nameRules" v-model="formData.nameVal"
            placeholder="请输入昵称"
            type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
            type="password"
            placeholder="请输入密码"
            :rules="passwordRules"
            v-model="formData.passwordVal"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
            type="password"
            placeholder="请再次密码"
            :rules="repeatPasswordRules"
            v-model="formData.repeatPassword"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">注册新用户</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue"
import ValidateForm from "../components/ValidateForm.vue";
import ValidateInput, {RuleProps} from "../components/ValidateInput.vue";
import axios from "axios";
import createMessageAlert from "../apis/createMessageAlert";
import router from "../router";
export default defineComponent({
  name: "SignUpPage",
  components: {ValidateForm, ValidateInput},
  setup(props, context) {
    const formData = reactive({
      emailVal: '',
      nameVal: '',
      passwordVal: '',
      repeatPassword: ''
    })
    const emailRules: RuleProps = [
      {type: 'required', message: '邮箱不能为空'},
      {type: 'email', message: '邮箱填写不符合规则'}
    ]
    const nameRules: RuleProps = [
      {type: "required", message: '名称不能为空'},
    ]
    const passwordRules: RuleProps = [
      {type: "required", message: '密码不能为空'}
    ]
    const repeatPasswordRules: RuleProps = [
      {type: "required", message: '重复密码不能为空'},
      {
        type: "custom",
        message: '重复密码不相同',
        validator: () => formData.passwordVal === formData.repeatPassword
      }
    ]
    const onFormSubmit = (res: boolean) => {
      if (res) {
        const payload = {
          email: formData.emailVal,
          password: formData.passwordVal,
          nickName: formData.nameVal
        }
        axios.post('/users/', payload).then(_ => {
          createMessageAlert('注册成功, 2秒后跳转至登录界面', 'success', 2000)
          setTimeout(() => {
            console.log('这个回调执行了')
            router.push('/login')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    return {
      onFormSubmit,
      formData,
      emailRules,
      nameRules,
      passwordRules,
      repeatPasswordRules
    }
  }
})
</script>

<style scoped>

</style>
