import MessageAlert, {MessageAlertType} from "../components/MessageAlert.vue";
import {h, render} from "vue";
import useDOMCreate from "../hooks/useDOMCreate";

const createMessageAlert = (message: string, type: MessageAlertType, timeout?: number) => {
    const messageAlertVnode = h(MessageAlert, {
        // 接收到的props参数
        message,
        type
    })
    // const mountedNode = useDOMCreate('message')
    const mountedNode = document.createElement('div')
    document.body.append(mountedNode)
    render(messageAlertVnode, mountedNode)
    const destroy = () => {
        render(null, mountedNode)
        mountedNode.remove()
    }
    if (timeout) {
        setTimeout(() => {
            destroy()
        }, timeout)
    }
    return destroy
}

export default createMessageAlert
