<template>
    <div class="app">
        <layout @click-menu="onClickMenu" :menuList="menuList">
            <template #logo="{ collapsed }">
                <div class="logo">
                    <img src="./assets/logo.png" alt="logo">
                    <span v-show="!collapsed">ES-FCU 系统</span>
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
            <a-spin v-if="isRouterAlive" :spinning="loading.value"  wrapperClassName="router-spin">
                <router-view :key="route.fullPath" />
            </a-spin>
        </layout>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CaretDownOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons-vue'
import axios from './plugins/tool-axios'
import { storeToRefs } from 'pinia';
import Layout from '@/components/Layout.vue'
import { useMenuList } from '@/hooks/menuList'
import { onBeforeMount } from 'vue'


// 根据券商生成菜单
const {init} = useMenuList()
const loading = computed(() => axios.loading)
const { menuList } = storeToRefs(useMenuList())
// 获取员工列表
// 初始化项目
const { onClickMenu, route, breadcrumbList, isRouterAlive } = useInit()
onBeforeMount(() => {
    init()
})

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
        padding: 8px 24px;
        background: rgba(255, 255, 255, 0.2);

        img {
            background-color: cornsilk;
            border-radius: 10px;
            height: 100%;
            margin-right: 15px;
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

.ant-menu {
    .ant-menu-item.ant-menu-item-only-child {
        &:last-child {
            margin-bottom: 100px;
        }
    }
}
</style>
