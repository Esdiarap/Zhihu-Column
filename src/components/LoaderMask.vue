<template>
  <teleport to="#back">
    <div class="d-flex justify-content-center align-items-center h-100 w-100 loading-container">
      <div>
        <div class="spinner-border text-bg-primary" role="status">
          <span class="sr-only"></span>
        </div>
        <p v-if="text" class="text-primary small mt-2">{{text}}</p>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import {defineComponent, onUnmounted} from "vue"
import useDOMCreate from "../hooks/useDOMCreate";

export default defineComponent({
  name: "LoaderMask",
  props:{
    text: {
      type: String,
    },
    background: {
      type: String
    }
  },
  setup() {
    useDOMCreate('back')
  }
})
</script>

<style scoped>
.loading-container {
  background: rgba(255,255,255,.5);
  backdrop-filter: blur(5px);
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.loading-container {
  text-align: center;
}
</style>
