import { validatePwd, updateNormal } from '@api'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

export const useAdmin = defineStore('admin', () => {
    const isSuperAdmin = ref(false)
    
    const validateAdmin = async (pwd, type) => {
        const res = await validatePwd({
            pwd,
            type
        })
        if (res.passed) {
            isSuperAdmin.value = true
        } else {
            message.error('密码错误')
        }
        return res.passed
    }

    const updateNormalAdmin = async (pwd) => {
        return await updateNormal({
            pwd,
        })
    }
    return {
        isSuperAdmin,
        validateAdmin,
        updateNormalAdmin,
    }
})

