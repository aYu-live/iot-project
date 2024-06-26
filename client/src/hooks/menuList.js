import { getMenuList } from '@api'
import { onBeforeMount, ref } from 'vue'
import { computed, defineAsyncComponent } from 'vue'
import { defineStore } from 'pinia'

export const useMenuList = defineStore('menuList', () => {
    const floorList = ref([])
    const hidenFloorManage = ref(true)
    const init = async () => {
        const { list } = await getMenuList()
        floorList.value = list
    }
    const menuList = computed(() => {
        const floorChildren = floorList.value.map(item => ({
            route: `/floor/${item.level}`,
            label: item?.alias || `第${item.level}层`,
            component: () => import('../views/floor/list.vue')
        }))
        if (!hidenFloorManage.value) {
            floorChildren.unshift({
                route: '/floor/manage',
                label: '楼层管理',
                component: () => import('../views/floor/manage.vue')
            })
        }
        return [
            {
                label: '楼层',
                route: '/',
                type: 'sub',
                icon: defineAsyncComponent(() => import('@ant-design/icons-vue/HomeOutlined')),
                children: floorChildren
            }
        ]
    })

    return { menuList, init, hidenFloorManage }
})

