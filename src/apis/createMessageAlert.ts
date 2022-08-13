import MessageAlert, {MessageAlertType} from "../components/MessageAlert.vue";
import {createApp} from "vue";
import useDOMCreate from "../hooks/useDOMCreate";

const createMessageAlert = (message: string, type: MessageAlertType, timeout = 2000) => {
    const messageAlertComponent = createApp(MessageAlert, {
        // 接收到的props参数
        message,
        type
    })
    const mountedNode = useDOMCreate('message')
    messageAlertComponent.mount(mountedNode)
    setTimeout(() => {
        messageAlertComponent.unmount()
        mountedNode.remove()
    }, timeout)
}

export default createMessageAlert
