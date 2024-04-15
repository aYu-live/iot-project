import { onMounted, ref } from 'vue'
import axios from '@/plugins/tool-axios'
const $http = axios.$http

function useStaff () {
    const allStaff = ref([])
    // 获取所有员工列表
    const getAllStaff = async () => {
        try {
            const res = await $http.get('/api/ftoa/getAllStaff')
            allStaff.value = (res.data || []).map(item => ({ ...item, value: item.id, label: `${item.nick}(${item.name})` }))
        } catch (err) {
            console.error('[获取员工列表错误]', err)
        }
    }
    onMounted(async () => {
        await getAllStaff()
    })
    return {
        allStaff
    }
}

export { useStaff }
