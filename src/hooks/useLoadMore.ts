import {computed, ComputedRef, ref} from "vue";
import {useStore} from "vuex";

interface LoadParams {
    currentPage: number
    pageSize: number,
    columnId?: string | string[]
}

/**
 * loadMore逻辑函数
 * @param actionName
 * @param total 总页数
 * @param params: currentPage, pageSize
 */
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = {
    currentPage: 2,
    pageSize: 5
}) => {
    const store = useStore()
    const currentPage = ref(params.currentPage)
    const requestParams = computed(() => ({ // 返回一个根据currentPage的计算属性，这样当currentPage增加的时候这个params也会变化
        currentPage: currentPage.value,
        pageSize: params.pageSize,
        cid: params.columnId
    }))
    const loadMorePage = async () => {
        await store.dispatch(actionName, requestParams.value).catch(e => console.error(e))
        currentPage.value++ // 下一页
    }
    const isLastPage = computed(() => Math.ceil(total.value / params.pageSize) < currentPage.value)
    return {
        loadMorePage,
        isLastPage
    }
}

export default useLoadMore
