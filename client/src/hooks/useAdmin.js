import { validatePwd, updateNormal, checkHasSuperAdmin as checkHasSuperAdminApi } from '@api'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

export const useAdmin = defineStore('admin', () => {
    const isSuperAdmin = ref(false);
    const hasSuperAdmin = ref(false);
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

    const updateNormalAdmin = async (pwd, type) => {
        return await updateNormal({
            pwd,
            type: type || 'normal'
        })
    }

    const checkHasSuperAdmin = async () => {
        const res = await checkHasSuperAdminApi();
        hasSuperAdmin.value = res.has
    }
    
    return {
        hasSuperAdmin,
        isSuperAdmin,
        validateAdmin,
        updateNormalAdmin,
        checkHasSuperAdmin,
    }
})

