<template>
    <a-layout :class="$style.layout">
        <a-layout-sider width="200" collapsible v-model:collapsed="collapsed">
            <slot name="logo" :collapsed="collapsed"></slot>
            <a-menu theme="dark" mode="inline" @click="onClickMenu" :selectedKeys="selectedKeys"
                    :openKeys="selectedKeys" style="margin-top: 10px;">
                <template v-for="menu in menuList">
                    <template v-if="menu.type === 'sub'">
                        <a-sub-menu v-if="menu.type === 'sub'" :key="menu.route">
                            <template #icon>
                                <component v-if="menu.icon" :is="menu.icon" />
                            </template>
                            <template #title>
                                <span>
                                    <span>{{ menu.label }}</span>
                                </span>
                            </template>
                            <a-menu-item v-for="item in menu.children" :key="item.route">
                                <span>{{ item.label }}</span>
                            </a-menu-item>
                        </a-sub-menu>
                    </template>
                    <template v-else>
                        <a-menu-item :key="menu.route">
                            <template #icon>
                                <component v-if="menu.icon" :is="menu.icon" />
                            </template>
                            <span>{{ menu.label }}</span>
                        </a-menu-item>
                    </template>
                </template>
            </a-menu>
        </a-layout-sider>

        <a-layout>
            <a-layout-header class="navigation">
                <slot name="navigation"></slot>
            </a-layout-header>
            <a-layout-content :style="{ margin: '12px', background: '#fff' }">
                <slot></slot>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
export default {
    name: 'Layout',
    props: {
        // 菜单列表
        menuList: {
            type: Array,
            default: () => []
        }
    },

    // 暴露可用使用给父组件
    emits: [
        'click-menu'
    ],
    setup (props, { emit }) {
        const route = useRoute()
        // 菜单当前选中项目根据当前路由计算(当前路由及其父路由)
        const selectedKeys = computed(() => {
            const selectRouteList = [route.path]
            // 菜单中是否存在父节点
            const parentRoute = props.menuList.find(menu => {
                if (menu.type === 'sub' && menu.children) {
                    return menu.children.some(cMenu => cMenu.route === route.path)
                }
            })
            if (parentRoute) {
                selectRouteList.push(parentRoute.route)
            }
            // 路由中是否存在父节点
            if (route.meta.parent) {
                route.meta.parent.forEach(({ path }) => {
                    selectRouteList.push(path)
                })
            }
            return selectRouteList
        })

        // 点击菜单事件触发
        const onClickMenu = ({ key }) => {
            emit('click-menu', key)
        }
        // 菜单栏展开收起状态
        const collapsed = ref(false)
        return { onClickMenu, selectedKeys, collapsed }
    }

}
</script>

<style lang="less" module>
.layout {
    height: 100vh;

    :global {
        .header-wrapper {
            padding: 0;
            white-space: nowrap;
        }

        .navigation {
            background: #fff;
            height: 48px;
            line-height: 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 32px 0 12px;
        }
    }
}
</style>
