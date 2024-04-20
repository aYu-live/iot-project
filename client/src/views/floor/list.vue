<template>
     <a-form
            style="max-width: 600px"
        >
            <a-form-item label="网关IP">
                <a-select
                    :options="opts"
                    v-model:value="selectValue"
                    mode="multiple"
                    allow-clear
                    showSearch
                    placeholder="请选择IP"
                    @change="onChange"
                />
            </a-form-item>
        </a-form>
    <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination">
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
import { deleteDevice, getDeviceList, getIpList } from '@api';
import { message, Modal } from 'ant-design-vue';

const columns = [
    {
        title: '设备编号',
        dataIndex: 'deviceId',
        key: 'deviceId',
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
        dataIndex: 'level',
        key: 'level',
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

const opts = ref([])
const selectValue = ref([]);
const dataSource = ref([]);
const pagination = reactive({ total: 0, pageSize: 20 })
const route = useRoute();

onBeforeRouteUpdate((to, from) => {
    to.meta.label = `第${to.params.floorId}楼`
})

onMounted(() => {
    getDeviceTableList()
    getIpOptList()
})

const getIpOptList = async () => {
    const data = await getIpList({
        level: route.params.floorId
    })
    opts.value = data.map(item => ({ label: item, value: item }))
}
const getDeviceTableList = async (ip) => {
    const {total, list} = await getDeviceList({ level: route.params.floorId, ip })
    dataSource.value = list
    pagination.total = total
}

const onChange = () => {
    getDeviceTableList(selectValue.value)
}

const handleDelete = (item) => {
    Modal.confirm({
        title: '确认删除',
        content: '是否删除该设备',
        onOk: async (close) => {
            await  deleteDevice(item)
            getDeviceTableList(selectValue.value)
            message.success('删除成功', 1, close)
            
        },
        okText: '确定',
        cancelText: '取消'
    })
}
</script>