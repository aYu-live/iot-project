
import { getFloorInfo } from '@api'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
    path: '/',
    meta: { label: '系统' },
    redirect: '/floor',
},
{
    path: '/floor',
    meta: { label: '楼层' },
    redirect: '/floor/manage',
},
{
    path: '/floor/manage',
    meta: { label: '楼层管理', parent: [{ path: '/floor', label: '楼层' }] },
    component: () => import('../views/floor/manage.vue')
},
{
    path: '/floor/:floorId',
    meta: { parent: [{ path: '/floor', label: '楼层' }] },
    component: () => import('../views/floor/list.vue')
}
]




const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach(async (to, from, next) => {
    if (to.fullPath.startsWith('/floor')) {
        const level = to.params.floorId
        if (level) {
            const floor = await getFloorInfo({ level })
            to.meta.label = floor?.alias || `第${level}层`
        }
    }
    next()
})

export default router