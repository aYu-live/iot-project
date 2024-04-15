import { onMounted, ref } from 'vue'
import axios from '@/plugins/tool-axios'
import { Modal } from 'ant-design-vue'
const $http = axios.$http

// 筛选条件
function useRemark () {
    const uid = '14790249'
    const remarkList = ref([])
    const remark_content = ref('')

    const getAllRemark = async () => {
        remarkList.value = (await $http.get('/api/remark/allRemarkCustomize', { uid: uid })).data
    }

    const addRemark = async () => {
        if (remark_content.value.length > 500) {
            Modal.error({
                content: '备注不能超过500字'
            })
            return
        }
        await $http.post('/api/remark/addRemark', { uid: uid, remark_content: remark_content.value })
        remark_content.value = ''
        getAllRemark()
    }

    const deleteRemark = async (id) => {
        await $http.post('/api/remark/deleteRemark', { uid: uid, id })
        getAllRemark()
    }
    onMounted(async () => {
        getAllRemark()
    })
    return { remarkList, remark_content, addRemark, deleteRemark }
}

export { useRemark }
