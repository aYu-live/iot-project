<template>
    <a-spin :spinning="loading">
        <a-form
            :label-col="labelCol"
            style="max-width: 600px"
        >
            <a-form-item label="网关IP">
                <a-input v-model:value="formModel.ip" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSubmit">查询</a-button>
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
                <template v-if="column.key === 'operator'">
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
import { getFloorList, createFloorList, deleteFloor } from '@api'
import * as XLSX from 'xlsx';

const PARAMS_MAP = {
    楼层: 'level',
    网关: 'ip',
    备注: 'remark'
}
const columns = [
    {
        title: '楼层',
        dataIndex: 'level',
        key: 'level',
    },
    {
        title: '网关',
        dataIndex: 'ip',
        key: 'ip',
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

const labelCol = { style: { width: '50px' } };
const formModel = ref({
    ip: ''
})
const loading = ref(false)
const dataSource = ref([]);
const pagination = reactive({ total: 0, disabled: true,  pageSize: 999 })

onMounted(() => {
    getTableList()
})
const handleSubmit = async () => {
    console.log(formModel.valu)
    getTableList(formModel.value)
}

const getTableList = async (params) => {
    const { total, list } = await getFloorList(params);
    dataSource.value = list
    pagination.total = total
}
// 这个方法阻止Upload组件自动上传文件
const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
    onSuccess("ok");
    }, 0);
}
const handleBeforeUpload = (file) => {
    loading.value = true
    const reader = new FileReader();
    let list = []
    reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        list = json.map(item => {
            const param = {};
            Object.keys(item).forEach(key => {
                param[PARAMS_MAP[key]] = item[key]
            })
            return param
        })
    };
    reader.onloadend = async () => {
        try {
            await createFloorList(list)
            getTableList(formModel.value)
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
            getTableList(formModel.value)
            message.success('删除成功', 1, close)
            
        },
        okText: '确定',
        cancelText: '取消'
    })
}
</script>
