import { getFloorList } from '@api'
import { onBeforeMount, ref } from 'vue'
import { computed, defineAsyncComponent } from 'vue'
import { defineStore } from 'pinia'

export const useMenuList = defineStore('menuList', () => {
    const floorList = ref([])
    const init = async () => {
        const { list } = await getFloorList()
        floorList.value = list
    }
    const menuList = computed(() => {
        const floorChildren = floorList.value.map(item => ({
            route: `/floor/${item.level}`,
            label: item?.alias || `第${item.level}层`,
            component: () => import('../views/floor/list.vue')
        }))
        return [
            {
                label: '楼层',
                route: '/',
                type: 'sub',
                icon: defineAsyncComponent(() => import('@ant-design/icons-vue/HomeOutlined')),
                children: [
                    {
                        route: '/floor/manage',
                        label: '楼层管理',
                        component: () => import('../views/floor/manage.vue')
                    },
                    ...floorChildren,
                ]
            }
        ]
    })
    return { menuList, init }
})

