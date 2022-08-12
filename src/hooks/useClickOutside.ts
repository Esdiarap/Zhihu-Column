import {onMounted, onUnmounted, ref, Ref} from "vue";

const useClickOutside = (elementRef: Ref<HTMLElement | null>)  => {
    const isClickOutside = ref(false)
    const handler = (e: MouseEvent) => {
        if (elementRef.value) { // 先判断ref是否指向一个DOM
            isClickOutside.value = !elementRef.value?.contains(e.target as HTMLElement);
        }
    }
    onMounted(() => {
        document.addEventListener('click', handler)
    })
    onUnmounted(() => {
        document.removeEventListener('click', handler)
    })
    return isClickOutside
}

export default useClickOutside
