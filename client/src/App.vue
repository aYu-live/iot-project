<template>
    <div class="app">
        <layout @click-menu="onClickMenu" :menuList="menuList">
            <template #logo="{ collapsed }">
                <div class="logo">
                    <img src="./assets/logo.png" alt="logo">
                    <span v-show="!collapsed">xx系统</span>
                </div>
            </template>
            <template #header="{ collapsed }">
                <div class="header">
                    <a-avatar icon="user" :src="niuniu" />
                    <a-dropdown v-if="!collapsed">
                        <span class="nick">管理员
                            <CaretDownOutlined />
                        </span>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <a href="/login/logout">退出系统</a>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </template>
            <template #navigation>
                <div class="breadcrumb">
                    <environment-outlined class="location-icon"/>
                    <label style="white-space: pre;">当前位置：</label>
                    <a-breadcrumb separator=">">
                        <a-breadcrumb-item v-for="r in breadcrumbList" :key="r.path">
                            <span v-if="r.path === route.path">
                                {{ r.label }}
                            </span>
                            <router-link v-else :to="r.path">
                                {{ r.label }}
                            </router-link>
                        </a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
            </template>
            <a-spin v-if="isRouterAlive" :spinning="loading"  wrapperClassName="router-spin">
                <router-view :key="route.fullPath" />
            </a-spin>
        </layout>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CaretDownOutlined, EnvironmentOutlined } from '@ant-design/icons-vue'
import axios from './plugins/tool-axios'
import Layout from '@/components/Layout.vue'
import { useMenuList } from '@/hooks/menuList'
import niuniu from '@/assets/niuniu.png'

export default {
    name: 'App',

    components: { Layout, CaretDownOutlined, EnvironmentOutlined },

    setup () {
        // 根据券商生成菜单
        const { menuList } = useMenuList()
        // 获取员工列表
        // 初始化项目
        const { onClickMenu, route, breadcrumbList, isRouterAlive } = useInit()
        return {
            menuList,
            onClickMenu,
            route,
            breadcrumbList,
            loading: axios.loading,
            niuniu,
            isRouterAlive,
        }
    }
}

function useInit () {
    const router = useRouter()
    const route = useRoute()
    const onClickMenu = r => {
        router.push({ path: r })
    }
    // 计算面包屑
    const breadcrumbList = computed(() => {
        if (route.meta.parent) {
            return [...route.meta.parent, { label: route.meta.label, path: route.path }]
        } else {
            return [{ label: route.meta.label, path: route.path }]
        }
    })
    // 内容区域状态
    const isRouterAlive = ref(true)
    
    return { onClickMenu, route, breadcrumbList, isRouterAlive }
}
</script>

<style lang="less">
.app {
    .logo {
        display: flex;
        align-items: center;
        color: #fff;
        white-space: nowrap;
        height: 48px;
        padding: 0 24px;
        background: rgba(255, 255, 255, 0.2);

        img {
            margin-right: 15px;
        }
    }

    .header {
        padding: 0 24px;
        color: rgba(255, 255, 255, 0.65);

        .nick {
            cursor: pointer;
            margin-left: 15px;

            .anticon {
                transform: translateY(2px);
                margin-left: 8px;
            }

            &:hover {
                .anticon {
                    transform: rotate(180deg);
                }
            }
        }
    }

    .location-icon {
        color: rgba(0, 0, 0, 0.45);
        padding: 0 4px 0 2px;
    }

    .router-spin {
        height: 100%;

        &>div>.ant-spin {
            max-height: initial;
        }

        &>.ant-spin-container {
            height: 100%;
            padding: 12px;
            overflow: auto;
        }
    }

    .breadcrumb {
        display: flex;
        align-items: center;
    }

    .lang-switch.ant-switch {
        transition: all 0.1s;
        width: 50px;
        background: #1890ff;
        &::after {
            transition: all 0.1s;
        }
    }
}
</style>
