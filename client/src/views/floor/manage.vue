<template>
    <a-spin :spinning="loading">
        <a-form
            :label-col="labelCol"
            style="max-width: 600px"
        >
            <a-form-item label="网关IP">
                <a-select
                    :options="ipList"
                    v-model:value="formModel.ip"
                    mode="multiple"
                    allow-clear
                    showSearch
                    placeholder="请选择IP"
                    @change="onChange"
                />
            </a-form-item>
            <a-form-item label="楼层">
                <a-select
                    :options="levelOpts"
                    v-model:value="formModel.level"
                    mode="multiple"
                    allow-clear
                    placeholder="请选择楼层"
                    @change="onChange"
                />
            </a-form-item>
        </a-form>
        <a-upload
            :before-upload="handleBeforeUpload"
            :customRequest="dummyRequest"
            :fileList="[]"
            accept=".xlsx, .xls"
        >
            <a-button>
                <a-icon type="upload" /> 点击上传Excel
            </a-button>
        </a-upload>
        <a-table
            :dataSource="dataSource"
            :columns="columns"
            :pagination="pagination"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'deviceId'">
                    {{ record.deviceId.map(item => item.id).join('、') }}
                </template>
                <template v-else-if="column.key === 'ip'">
                    {{ record.ip.join('、') }}
                </template>
                <template v-else-if="column.key === 'operator'">
                    <span>
                        <a @click="() => handleDelete(record)">删除</a>
                    </span>
                </template>
            </template>
        </a-table>
    </a-spin>
</template>

<script setup>
import { message, Modal } from 'ant-design-vue';
import { reactive, ref, onMounted } from 'vue';
import { getFloorList, createFloorList, deleteFloor, createDeviceList, getIpList } from '@api'
import * as XLSX from 'xlsx';

const columns = [
    {
        title: '楼层',
        dataIndex: 'level',
        key: 'level',
        width: 80
    },
    {
        title: '网关',
        dataIndex: 'ip',
        key: 'ip',
        width: 300
    },
    {
        title: '设备',
        dataIndex: 'deviceId',
        key: 'deviceId',
    },
    {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 100
    },
    
]

const labelCol = { style: { width: '50px' } };
const formModel = ref({
    ip: [],
    level: []
})
const loading = ref(false)
const dataSource = ref([]);
const ipList = ref([])
const levelOpts = ref([])
const pagination = reactive({ total: 0, disabled: true,  pageSize: 999 })

onMounted(() => {
    getTableList({first: true})
    getIps()
})
const onChange = async () => {
    getTableList({params: formModel.value})
}

const getIps = async () => {
    const ips = await getIpList()
    ipList.value = ips.map(item => ({ label: item, value: item }))
}

const getTableList = async ({first, params}) => {
    const { total, list } = await getFloorList(params);
    dataSource.value = list
    pagination.total = total
    if (first) {
        levelOpts.value = list.map(item => ({ label: `第${item.level}楼`, value: item.level }))
    }
}
// 这个方法阻止Upload组件自动上传文件
const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
    onSuccess("ok");
    }, 0);
}

const transFloorList = (data) => {
    try {
    const result = data.reduce((acc, { 所属网关IP: ip, 楼层: level }) => {
        const found = acc.find(e => e.level === level);
        if(!found){
            acc.push({level, ip:[ip]});
        }else{
            !found.ip.includes(ip) && found.ip.push(ip);
        }
        return acc;
    }, []);
    return result
} catch (error) {
    return []
}
}

const handleBeforeUpload = (file) => {
    loading.value = true
    const reader = new FileReader();
    let floorList = []
    let deviceList = []
    reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        floorList = transFloorList(json);
        deviceList = json.map(({
            设备编号: deviceId,
            所在房间: room,
            所属网关IP: ip,
            网关DADR: DADR,
            本机地址: localAddress,
            楼层: level,
            备注: remark
        }) => ({
            deviceId,
            room,
            DADR,
            ip,
            localAddress,
            level,
            remark,
        }))
    };
    reader.onloadend = async () => {
        try {
            await createFloorList(floorList)
            await createDeviceList(deviceList)
            getTableList({params: formModel.value})
            message.success('上传成功')
        } finally {
            loading.value = false
        }
    }
    reader.onerror = () => {
        message.error('解析失败')
    }
    reader.readAsArrayBuffer(file);
    
    // 阻止默认上传行为
    return false;
}


const handleDelete = (item) => {
    Modal.confirm({
        title: '确认删除',
        content: '是否删除该楼层信息',
        onOk: async (close) => {
            await deleteFloor(item)
            getTableList({params: formModel.value})
            message.success('删除成功', 1, close)
            
        },
        okText: '确定',
        cancelText: '取消'
    })
}
</script>
