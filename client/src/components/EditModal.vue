<template>
    <a-modal
        :open="props.open"
        :footer="null"
        destroyOnClose
        @cancel="onCancel"
        @afterClose="onCancel"
        width="900px"
    >
        <a-form
            ref="formRef"
            :model="formState"
            v-bind="formItemLayout"
        >
            <a-form-item label="房间号">
                <span class="ant-form-text">{{ formState.room }}</span>
            </a-form-item>
            <a-form-item label="备注">
                <span class="ant-form-text">{{ formState.remark || '--' }}</span>
            </a-form-item>
            <a-form-item label="所属网关">
                <span class="ant-form-text">{{ formState.ip }}</span>
            </a-form-item>
            <a-form-item label="设备编号">
                <span class="ant-form-text">{{ formState.deviceId }}</span>
            </a-form-item>
            <a-form-item label="状态">
                <span class="ant-form-text">{{ formState.online ? '在线' : '离线' }}</span>
            </a-form-item>
            <a-form-item label="密码" :rules="[{ required: true, message: '请输入密码' }]">
                <a-input-password v-model:value="formState.password" placeholder="请输入密码" :min="1" :max="10" />
            </a-form-item>
            <a-form-item
                class="radio-select"
                name="40101"
                label="模式"
                has-feedback
                :rules="[{ required: true, message: '请选择模式' }]"
            >
                <a-radio-group v-model:value="formState['40101']" placeholder="请选择模式" option-type="button" :options="statusOpts">
                </a-radio-group>
                <a-button style="margin-left: 20px" @click="handleUpdate('40101')" type="primary" :disabled="disabled">更新</a-button>
            </a-form-item>
            <a-form-item
                class="radio-select"
                name="40102"
                label="风速"
                has-feedback
                :rules="[{ required: true, message: '请选择风速' }]"
            >
                <a-radio-group v-model:value="formState['40102']" placeholder="请选择风速" option-type="button" :options="speedOpts">
                </a-radio-group>
                <a-button style="margin-left: 20px" @click="handleUpdate('40102')" type="primary" :disabled="disabled">更新</a-button>
            </a-form-item>
            <a-form-item
                class="radio-select"
                name="40001"
                label="冷热切换"
                has-feedback
                :rules="[{ required: true, message: '请切换制冷热模式' }]"
            >
                <a-radio-group v-model:value="formState['40001']" placeholder="请切换制冷热模式" option-type="button" :options="mode01Opts">
                </a-radio-group>
                <a-button style="margin-left: 20px" @click="handleUpdate('40001')" type="primary" :disabled="disabled">更新</a-button>
            </a-form-item>
            <a-form-item
                class="radio-select"
                name="40103"
                label="温度"
                has-feedback
                :rules="[{ required: true, message: '请输入温度' }]"
            >
                <a-input-number v-model:value="formState['40103']" min="5"  max="40" placeholder="请输入温度" addon-after="°C"></a-input-number>
                <a-button style="margin-left: 20px" @click="handleUpdate('40103')" type="primary" :disabled="disabled">更新</a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Form, FormItem, InputPassword, InputNumber, RadioGroup, Select, Modal, message } from 'ant-design-vue';
import { statusMap, mode01Map, speedMap } from '@/constants'
import { updateDevice } from '@api';

const props = defineProps({
    open: Boolean,
    record: Object
})

const emits = defineEmits(['cancel', 'success'])
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const formInitState = {
    room: '',
    remark: '',
    ip: '',
    deviceId: '',
    online: '',
    password: '',
    40001: '',
    40101: '',
    40102: '',
    40103: '',

}

const formState = ref({
    ...formInitState,
    ...(props.record || {})
})

watch(
  () => props.record,
  (newRecord) => {
    if (newRecord) {
        formState.value = {
            ...formInitState,
            ...newRecord,
            40001: String(Number(newRecord[40001])),
            40101: String(Number(newRecord[40101])),
            40102: String(Number(newRecord[40102])),
            40103: String(Number(newRecord[40103])) || '',
        };
    } else {
        formState.value = {
            ...formInitState
        }
    }
  },
  {
    deep: true // 深度监听，以防 record 对象内部属性变化时需要更新
  }
);
const disabled = computed(() => !formState.value.password)

const speedOpts = computed(() => {
    return Object.keys(speedMap).sort((a, b) => a - b > 0).map(item => ({
        value: item,
        label: speedMap[item]
    }))
})

const mode01Opts = computed(() => {
    return Object.keys(mode01Map).sort((a, b) => a - b > 0).map(item => ({
        value: item,
        label: mode01Map[item]
    }))
})

const statusOpts = computed(() => {
    return Object.keys(statusMap).sort((a, b) => a - b > 0).map(item => ({
        value: item,
        label: statusMap[item]
    }))
})
const onOk = () => {
    if (!formState.value.password || formState.value.password !== 'ecosync') {
        message.error('密码有误，请重新输入')
        return
    }
    console.log(1)
}

const onCancel = () => {
    formState.value = {...formInitState}
    emits('cancel')
}

const handleUpdate = async (key) => {
    if (!formState.value.password || formState.value.password !== '1234') {
        return message.error('密码校验失败，请重新输入密码')
    }
    const res = await updateDevice({
        id: formState.value.id,
        key,
        value: formState.value[key]
    })
    if (res.result) {
        emits('success')
        message.success('更新成功')
    }
}
</script>

<style lang="less">
    &.ant-form-item.radio-select .ant-form-item-control-input-content {
        display: flex;
        justify-content: space-between;
    }
</style>