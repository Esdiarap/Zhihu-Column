<template>
  <teleport to="#modal">
    <div class="modal d-block" tabindex="-1" v-if="visible">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{title}}</h5>
            <button type="button" class="btn-close" data-dismiss="modal" @click="onClose">
              <span></span>
            </button>
          </div>
          <div class="modal-body">
            <slot><p>Modal Body Here</p></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="onClose">撤销修改</button>
            <button type="button" class="btn btn-primary" @click="onConfirm">保存修改</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import useDOMCreate from "../hooks/useDOMCreate";

export default defineComponent({
  name: "ModalAlert",
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['modal-on-close', 'modal-on-confirm'],
  setup(props, context) {
    useDOMCreate('modal')
    const onClose = () => {
      context.emit('modal-on-close')
    }
    const onConfirm = () => {
      context.emit('modal-on-confirm')
    }
    return  {
      onClose,
      onConfirm
    }
  }
})
</script>

<style scoped>

</style>
