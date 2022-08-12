<template>
  <div class="dropdown" ref="dropdownRef">
    <a href="#"
       class="dropdown-toggle btn btn-outline-light my-2"
       @click="toggleOpen"
    >
      {{`你好 ${title}`}}
    </a>
    <ul class="dropdown-menu" v-if="isOpen" style="display: block">
       <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from "vue"
import useClickOutside from "../hooks/useClickOutside";

export default defineComponent({
  name: "DropdownMenu",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const isOpen = ref(false)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }

    // 点击外部关闭isOpen
    const dropdownRef = ref<HTMLElement | null>(null)
    const isClickOutside = useClickOutside(dropdownRef)
    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false
      }
    })

    return {
      isOpen,
      toggleOpen,
      dropdownRef
    }
  }
})
</script>

<style scoped>

</style>
