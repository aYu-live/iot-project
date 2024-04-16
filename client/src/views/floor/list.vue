<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :pagination="pagination"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operator'">
                <span>
                    <a @click="() => handleDelete(record)">删除</a>
                </span>
            </template>
        </template>
    </a-table>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { getDeviceList } from '@api';

const columns = [
    {
        title: '设备编号',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '所属网关IP',
        dataIndex: 'ip',
        key: 'ip',
    },
    {
        title: '网关DADR',
        dataIndex: 'DADR',
        key: 'DADR',
    },
    {
        title: '本机地址',
        dataIndex: 'localAddress',
        key: 'localAddress',
    },
    {
        title: '楼层',
        dataIndex: 'floorLevel',
        key: 'floorLevel',
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
    },
    {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
    },
    
]
const dataSource = ref([]);
const pagination = reactive({ total: 0, disabled: true,  pageSize: 999 })
const route = useRoute();

onBeforeRouteUpdate((to, from) => {
    to.meta.label = `第${to.params.floorId}楼`
})

onMounted(() => {
    getDeviceTableList()
})
const getDeviceTableList = async () => {
    dataSource.value = getDeviceList({ level: route.params.floorId })
}
</script>