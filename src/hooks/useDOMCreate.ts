import {onUnmounted} from "vue";

const useDOMCreate = (id: string) => {
    const node = document.createElement('div')
    node.id = id
    document.body.append(node)
    onUnmounted(() => {
        node && node.remove()
    })
    return node
}

export default useDOMCreate
