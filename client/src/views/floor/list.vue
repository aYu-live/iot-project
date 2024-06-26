<template>
     <!-- <a-form
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
    </a-form> -->
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :pagination="false"
        :row-class-name="(record) => (record.online ?  null : 'off-line')"
        :row-key="record => `${record.id}-${record.room}`"
            :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
            }"
    >
        <template #title>
            <a-space style="font-weight:600; font-size: 20px;display: flex;justify-content: space-between;">
                <span>{{level}}</span>
                <a-button type="primary" :disabled="!hasSelected" @click="handleOpenBtachEditModal">
                    批量修改
                </a-button>
            </a-space>
        </template>
        <template #bodyCell="{ text, column, record }">
            <template v-if="Number.isFinite(+column.key)">
                <span>
                    {{ getDisplayType(column.key, {
                        OFF: column.key === '31004' ? '4'
                            : column.key === '40011' ? '4.5'
                            : column.key === '40012' ? '40.5' : undefined
                    })(text) }}
                </span>
            </template>
            <template v-else-if="column.key === 'operator'">
                <span>
                    <a v-if="false" @click="() => handleDelete(record)">删除</a>
                </span>
                <span>
                    <a @click="() => handleOpenEditModal(record)">操作</a>
                </span>
            </template>
            <template v-else>
                {{ text }}
            </template>
        </template>
    </a-table>
    <edit-modal :open="record.visible" :record="record" :selected-row-keys="selectedRowKeys" @cancel="cancel" @success="success"></edit-modal>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from "vue-router";
import { deleteDevice, getDeviceList, getIpList, getFloorInfo } from '@api';
import { message, Modal } from 'ant-design-vue';
import { computed } from 'vue';
import { statusMap, mode01Map, speedMap, status03Map } from '@/constants'
import EditModal from '@/components/EditModal.vue'
import io from 'socket.io-client';

let socket = null
const opts = ref([])
const selectValue = ref([]);
const dataSource = ref([]);
const pagination = reactive({ total: 0, pageSize: 10000 })
const route = useRoute();
const highlightedCells = reactive({})
const level = ref();
const record = ref({
    visible: false
})
const selectedRowKeys = ref([])
const hasSelected = computed(() => selectedRowKeys.value.length > 0)

onMounted(async () => {
    const floor = await getFloorInfo({ level: route.params.floorId })
    level.value =  floor?.alias || `第${floor.level}层`
})

const columns = computed(() => {
    const column = [
    {
        title: '房间号',
        dataIndex: 'room',
        key: 'room',
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
    },
    // {
    //     title: 'IP',
    //     dataIndex: 'ip',
    //     key: 'ip',
    // },
    {
        title: '设备状态反馈',
        dataIndex: '31001',
        key: '31001',
    },
    {
        title: '风机速度反馈',
        dataIndex: '31002',
        key: '31002',
    },
    {
        title: '实际温度反馈',
        dataIndex: '31003',
        key: '31003',
    },
    {
        title: '目标温度反馈',
        dataIndex: '31004',
        key: '31004',
    },
    {
        title: '门磁状态反馈',
        dataIndex: '31011',
        key: '31011',
    },
    {
        title: '制冷、制热模式',
        dataIndex: '40001',
        key: '40001',
    },
    {
        title: '温度修正',
        dataIndex: '40005',
        key: '40005',
    },
    {
        title: '制热节能下限值',
        dataIndex: '40011',
        key: '40011',
    },
    {
        title: '制冷节能上限值',
        dataIndex: '40012',
        key: '40012',
    },
    {
        title: '门磁功能',
        dataIndex: '40038',
        key: '40038',
    },
    {
        title: '设备状态设定',
        dataIndex: '40101',
        key: '40101',
    },
    {
        title: '风机速度设定',
        dataIndex: '40102',
        key: '40102',
    },
    {
        title: '目标温度设定',
        dataIndex: '40103',
        key: '40103',
    },
    {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 120
    },

    ]
    return column.map(item => ({
    ...item,
    align: 'center',
    customCell: (record, _, columnIndex) => {
        const cellKey = `${record.id}-${columnIndex.dataIndex}`;
        return  {
            class: highlightedCells[cellKey]? 'highlighted' : ''
        }
    }
}))
});

onMounted(() => {
    getDeviceTableList()
    getIpOptList()
    connectSock()
})

onBeforeUnmount(() => {
    socket?.disconnect?.();  // 在组件销毁之前断开连接
    socket = null
})

const connectSock = () => {
    console.log(import.meta.env.MODE)
    socket = io(`http://${import.meta.env.MODE === 'production' ? '192.168.23.5': '127.0.0.1'}:3000/deviceIo`);  // 连接到WebSocket服务器

    socket.on('connect', () => {
        // console.log('Connected to the WebSocket server.');
    });

    // Listen for 'server-message' event from the server
    socket.on('updateDevices', (message) => {
        addMessageTodataSource(message)
    });

    socket.on('disconnect', () => {
        // console.log('Disconnected from the WebSocket server.');
    });
}

const addMessageTodataSource = (message) => {
    if (message?.length && dataSource.value?.length) {
        for (let mes of message) {
            dataSource.value.forEach(item => {
                const { id, ip, attr, deviceId } = item
                if (
                    deviceId === mes.deviceId &&
                    ip === mes.ip
                ) {
                    const flag = item[mes.attr] !== mes.val
                    item[mes.attr] = mes.val
                    item.online = mes.online
                    flag && setHighlight(id, mes.attr)
                }
            })
        }
    }

}

const setHighlight = (id, field) => {
    const key = `${id}-${field}`;
    highlightedCells[key] = true

    setTimeout(() => {
        highlightedCells[key] = false
    }, 1000); // 1秒后移除高亮
}

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

const getDisplayType = (type, { OFF }) => (value) => {
    if (value === undefined || value === null || value === '') {
        return '-'
    }
    const val = Number(value)
    
    const status01Map = {
        0: '闭合',
        1: '打开',
    }

    const tempDisplay = (c) => `${c}°C`
    switch (type) {
        case '31001':
        case '40101':
             return statusMap[val] || '-'
        case '31002':
        case '40102':
            return speedMap[val] || '-'
        case '31004':
        case '40011':
        case '40012':
            if (val === Number(OFF)) return 'OFF'
            return tempDisplay(val) || '-'
        case '31011':
            return status01Map[val] || '-'
        case '40001':
            return mode01Map[val] || '-'
        case '40038':
            return status03Map[val] || '-'
        default:
            return tempDisplay(val) || '-'
    }
}

const handleOpenEditModal = (item = {}) => {
    record.value = {
        ...item,
        visible: true
    }
}

const handleOpenBtachEditModal = () => {
    record.value = {
        visible: true,
        isBatch: true
    }
}

const liveRecord = computed(() => {
    return dataSource.value.find(item => item.id === record.value.id)
})

const cancel = () => {
    record.value = {
        visible: false,
        isBatch: false
    }
}

const success = () => {
    getDeviceTableList(selectValue.value)
}

const onSelectChange = (keys) => {
    selectedRowKeys.value = keys
}

</script>

<style lang="less">
:where(.css-dev-only-do-not-override-1hsjdkk).ant-card .ant-card-body {
    padding-left: 0;
    padding-right: 0;
}
:where(.css-dev-only-do-not-override-1hsjdkk).ant-table-wrapper .ant-table-tbody >tr.ant-table-row:hover>td.highlighted, :where(.css-dev-only-do-not-override-1hsjdkk).ant-table-wrapper .ant-table-tbody >tr >td.ant-table-cell-row-hover.highlighted {
    background-color: sandybrown; /* 高亮颜色 */
    transition: background-color 1s ease-out;
}
.highlighted {
  background-color: sandybrown; /* 高亮颜色 */
  transition: background-color 1s ease-out;
}

:where(.css-dev-only-do-not-override-1hsjdkk).ant-table-wrapper .ant-table-tbody >tr.ant-table-row.off-line:hover>td, :where(.css-dev-only-do-not-override-1hsjdkk).ant-table-wrapper .ant-table-tbody >tr.off-line >td.ant-table-cell-row-hover {
    opacity: 0.5 !important;
    background: rgb(157, 155, 155, .3) !important;
    color: #222 !important;
}
.off-line, .off-line>td {
    opacity: 0.5 !important;
    background: rgb(157, 155, 155, .3) !important;
    color: #222 !important;
}
</style>