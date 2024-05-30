<template>
    <template v-if="!isSuperAdmin">
        <h1>请先输入超级管理员密码</h1>
        <div style="margin: 20px 100px;">
            <a-input v-model:value="pwd" placeholder="请输入超级管理员密码"></a-input>
            <div style="height: 20px;"></div>
            <a-button block type="primary" @click="handleValidate">校验密码</a-button>
        </div>
    </template>
    <a-spin v-else :spinning="loading">
        <!-- <a-form
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
        </a-form> -->
        <a-space>
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
            <a-button type="primary" :disabled="!hasSelected" @click="handleBatchDelete">
                批量删除
            </a-button>
            <a-button type="dashed" @click="pwdRecord.visible = true">改普通密码</a-button>
        </a-space>
        <a-table

            :dataSource="dataSource"
            :columns="columns"
            :pagination="pagination"
            :row-key="record => record.level"
            :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
            }"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'deviceId'">
                    {{ record.deviceId.map(item => item.id).join('、') }}
                </template>
                <template v-else-if="column.key === 'ip'">
                    {{ record.ip.join('、') }}
                </template>
                <template v-else-if="column.key === 'operator'">
                    <a-space>
                        <a @click="() => handleDelete(record)">删除</a>
                        <a @click="() => handleRename(record)">重命名</a>
                    </a-space>
                </template>
            </template>
        </a-table>
        <a-modal v-model:open="renameRecord.visible" ok-text="提交" title="楼层重命名" @ok="handleRenameFloor" @cancel="cancelRenameFloor" destroy-on-close cancel-text="取消">
            <a-input v-model:value="renameRecord.alias"</a-input>
        </a-modal>
        <a-modal v-model:open="pwdRecord.visible" ok-text="提交" title="更改普通密码" @ok="handleUpdatePwd" @cancel="handleCancelPwd" destroy-on-close cancel-text="取消">
            <a-input v-model:value="pwdRecord.pwd"</a-input>
        </a-modal>
    </a-spin>
</template>

<script setup>
import { message, Modal, Space } from 'ant-design-vue';
import { reactive, ref, onMounted } from 'vue';
import { getFloorList, createFloorList, deleteFloor, createDeviceList, getIpList, renameFloor } from '@api'
import * as XLSX from 'xlsx';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMenuList } from '@/hooks/menuList';
import { useAdmin } from '@/hooks/useAdmin'

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
        width: 120
    },
    
]

const labelCol = { style: { width: '50px' } };
const { init } = useMenuList()
const { validateAdmin, updateNormalAdmin } = useAdmin()
const { isSuperAdmin } = storeToRefs(useAdmin())
const pwdRecord = reactive({
    visible: false,
    pwd: ''
})
const pwd = ref('')

const formModel = ref({
    ip: [],
    level: []
})
const loading = ref(false)
const dataSource = ref([]);
const ipList = ref([])
const levelOpts = ref([])
const pagination = reactive({ total: 0, disabled: true,  pageSize: 999 })
const selectedRowKeys = ref([])
const hasSelected = computed(() => selectedRowKeys.value.length > 0)
const renameRecord = reactive({
    visible: false
})
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
        levelOpts.value = list.map(item => ({ label: item?.alias || `第${item.level}层`, value: item.level }))
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
    const result = data.reduce((acc, { ip, level }) => {
        const found = acc.find(e => e.level === level);
        if(!found){
            acc.push({ level, ip:[ip], isDelete: false });
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
            deviceId,
            room,
            ip,
            level,
            remark
        }) => ({
            deviceId,
            room,
            ip,
            level,
            remark,
            isDelete: false
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

const onSelectChange = (keys) => {
  selectedRowKeys.value = keys;
};

const handleBatchDelete = () => {
    Modal.confirm({
        title: '确认删除',
        content: '是否批量删除选中的楼层',
        onOk: async (close) => {
            await deleteFloor(selectedRowKeys.value)
            selectedRowKeys.value = []
            getTableList({params: formModel.value})
            message.success('删除成功', 1, close)
            
        },
        okText: '确定',
        cancelText: '取消'
    })
}

const handleRename = (record) => {
    renameRecord.level = record.level
    renameRecord.visible = true
    renameRecord.alias = record.alias
}

const handleRenameFloor = async (done) => {
    await renameFloor(renameRecord)
    getTableList({params: formModel.value})
    init()
    cancelRenameFloor()
}

const cancelRenameFloor = () => {
    renameRecord.alias = ''
    renameRecord.level = undefined
    renameRecord.visible = false
}

const handleValidate = () => {
    validateAdmin(pwd.value, 'super')
}

const handleUpdatePwd = async () =>{
    await updateNormalAdmin(pwdRecord.pwd)
    handleCancelPwd()
}

const handleCancelPwd = () => {
    pwdRecord.visible = false;
    pwdRecord.pwd = ''
}

</script>
