
import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
    path: '/',
    meta: { label: '系统' },
    redirect: '/floor',
},
{
    path: '/',
    meta: { label: '楼层' },
    redirect: '/floor',
},
{
    path: '/floor/manage',
    meta: { label: '楼层管理', parent: [{ path: '/floor', label: '楼层' }] },
    component: () => import('../views/floor/manage.vue')
},
{
    path: '/floor/:floorId',
    meta: { parent: [{ path: '/floor', label: '楼层' }] },
    beforeEnter: (to, _, next) => {
        to.meta.label = `第${to.params.floorId}楼`
        next()
    },
    component: () => import('../views/floor/list.vue')
},
// meta标签label、parent用于面包屑显示(使用例子如下)
// {
//   path: '/restrict-list',
//   meta: { label: '限制名单管理' },
//   component: () => import('../views/restrictList/index.vue')
// }, {
//   path: '/restrict-list/add',
//   meta: { label: '添加限制记录', parent: [{ path: '/restrict-list', label: '限制名单管理' }] },
//   component: () => import('../views/restrictList/addRestrictRecord.vue')
// }, {
//   path: '/restrict-list/details',
//   meta: { label: '详情', parent: [{ path: '/restrict-list', label: '限制名单管理' }] },
//   component: () => import('../views/restrictList/details.vue')
// }
]



const router = createRouter({
    history: createWebHistory(),
    routes
})



export default router