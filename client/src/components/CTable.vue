<template>
    <div :class="`c-table ${$attrs.class ? $attrs.class : ''}`">
        <div class="tools-row" v-if="!noTool" >
            <slot name="tool"></slot>
            <a-pagination
                show-quick-jumper
                :show-size-changer="false"
                :show-total="total => `Total ${data.total}`"
                v-model:current="filterOptions.page"
                v-model:pageSize="filterOptions.pageSize"
                :total="data.total"
                @change="onChangePage"
            />
        </div>
        <a-table
            :columns="columns"
            :data-source="data.items"
            rowKey="id"
            size="small"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
            v-bind="$attrs"
            :pagination="false"
        >
            <template #bodyCell="{ text, record, index, column }">
                <template v-for="(_, name) in $slots" :key="name">
                    <template v-if="name === column.key">
                        <slot v-bind="{ text, record, index, column }" :name="name" />
                    </template>
                </template>
            </template>
        </a-table>
        <div class="tools-row" v-if="!noBottomPagination">
            <a-pagination
                class="bottom-pagination"
                show-quick-jumper
                :show-size-changer="false"
                :show-total="total => `Total ${data.total}`"
                v-model:current="filterOptions.page"
                v-model:pageSize="filterOptions.pageSize"
                :total="data.total"
                @change="onChangePage"
            />
        </div>
    </div>
</template>
<script>
import { inject } from 'vue'
export default {
    props: {
        columns: {
            type: Array,
            default: () => [],
            required: true
        },
        data: {
            type: Object,
            default: () => ({ items: [], total: 0 }),
            required: true
        },
        noTool: {
            type: Boolean,
            default: false
        },
        noBottomPagination: {
            type: Boolean,
            default: false
        }
    },
    setup (_, { emit }) {
        const filterOptions = inject('filterOptions', [])
        const onChangePage = () => {
            emit('changeOptions')
        }
        return {
            filterOptions,
            onChangePage
        }
    }
}
</script>
<style lang="less" scoped>
.c-table {
  margin-top: 10px;
  position: relative;
  .ant-table-wrapper{
    padding: 12px 0;
  }
  :deep(.table-striped) td {
    background-color: #fafafa;
  }
  .tools-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: @backgroundColor_gray;
    padding-left: 8px;
    .bottom-pagination{
        flex-grow: 1;
    }
  }
  .ant-pagination {
    background-color: @backgroundColor_gray;
    padding: 5px;
    margin: 0;
    text-align: right;
    flex-grow: 1;
  }
}
</style>
