<template>
    <div class="s-filter-options">
        <div class="filter-options-item" v-for="item in filterItems" :key="item.name">
            <label>{{ item.label }}</label>
            <a-radio-group v-model:value="filterOptions[item.name]" button-style="solid" size="small" @change="handleSearch(item.name)">
                <a-radio-button
                    v-for="option in item.options"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </a-radio-button>
            </a-radio-group>
        </div>
        <div class="filter-options-item">
            <label>查询条件</label>
            <div class="search-options">
                <template v-for="item in searchItems" :key="item.name">
                    <a-input
                        v-if="item.type === 'input'"
                        v-model:value.trim="filterOptions[item.name]"
                        :placeholder="item.placeholder"
                        :suffix="item.suffix"
                        v-bind="item.props"
                        allowClear
                    />
                    <a-input-number
                        v-if="item.type === 'inputNumber'"
                        v-model:value="filterOptions[item.name]"
                        :placeholder="item.placeholder"
                        v-bind="item.props"
                    />
                    <a-select
                        v-if="item.type === 'select'"
                        :mode="item.mode"
                        v-model:value="filterOptions[item.name]"
                        :placeholder="item.placeholder"
                        allowClear
                        v-bind="item.props"
                    >
                        <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                    <a-date-picker
                        v-if="item.type === 'date'"
                        format="YYYY-MM-DD"
                        :placeholder="item.placeholder"
                        v-model:value="filterOptions[item.name]"
                        allowClear
                    />
                    <a-input-group compact v-if="item.type === 'dateGroup'">
                        <a-select
                            v-if="item.hasDateType"
                            v-model:value="filterOptions[item.dateTypeName]"
                            :placeholder="item.dateTypePlaceholder || '日期类型'"
                            class="date-type"
                        >
                            <a-select-option v-for="d in item.dateTypeOptions" :key="d.value" :value="d.value">
                                {{ d.label }}
                            </a-select-option>
                        </a-select>
                        <a-date-picker
                            v-model:value="filterOptions[item.name[0]]"
                            value-format="YYYY-MM-DD"
                            :placeholder="(item.placeholder || [])[0] || '开始日期'"
                            :disabled-date="(startValue) => disabledStart(startValue, filterOptions[item.name[1]])"
                        />
                        <a-input class="tilde" placeholder="~" />
                        <a-date-picker
                            v-model:value="filterOptions[item.name[1]]"
                            value-format="YYYY-MM-DD"
                            :placeholder="(item.placeholder || [])[1] || '结束日期'"
                            :disabled-date="(endValue) => disabledEnd(endValue, filterOptions[item.name[0]])"
                        />
                    </a-input-group>
                    <!-- 公用选项 -->
                    <!-- 查询人下拉选择框 -->
                    <a-select
                        v-if="item.type === 'staff'"
                        allowClear
                        show-search
                        v-model:value="filterOptions[item.name]"
                        :placeholder="item.placeholder || 'Staff'"
                        :filter-option="filteredStaff"
                        class="staff"
                    >
                        <a-select-option v-for="s in allStaff" :key="s.id" :value="s.id" :title="s.label">
                            {{ s.label }}
                        </a-select-option>
                    </a-select>
                </template>
                <a-button @click="handleSearch()" type="primary">查询</a-button>
            </div>
        </div>
    </div>
</template>
<script>
import { inject } from 'vue'
export default {
    setup (_, { emit }) {
    // 注册筛选项数据
        const filterOptions = inject('filterOptions')
        const filterItems = inject('filterItems', [])
        const searchItems = inject('searchItems', [])
        const handleSearch = (optionName) => {
            filterOptions.page = 1
            emit('search', optionName)
        }

        // 查询人下拉
        const allStaff = inject('allStaff', [])
        const filteredStaff = (input, option) => (
            option.title?.toLowerCase().includes(input.toLowerCase())
        )

        // 开始结束日期限制
        const disabledStart = (startValue, endValue) => {
            if (!startValue || !endValue) {
                return false
            }
            return endValue < startValue.format('YYYY-MM-DD')
        }
        const disabledEnd = (endValue, startValue) => {
            if (!endValue || !startValue) {
                return false
            }
            return startValue > endValue.format('YYYY-MM-DD')
        }
        return {
            filterOptions,
            filterItems,
            searchItems,
            allStaff,
            filteredStaff,
            disabledStart,
            disabledEnd,
            handleSearch
        }
    }
}
</script>
<style lang="less" scoped>
.s-filter-options {
  .filter-options-item {
    display: flex;
    border: 1px solid @borderColor;
    overflow: hidden;
    &:nth-of-type(n+2){
      border-top: 0;
    }
    &>div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      row-gap: 4px;
      padding: 4px 0;
    }
    &>label{
      width: 100px;
      background-color: @backgroundColor_gray;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .ant-tag {
      font-size: 14px;
      margin: 0 0 0 12px;
      border: 1px solid #dde2eb;
      height: 24px;
      line-height: 22px;
    }
    .search-options {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      &>* {
        margin: 2px 0 2px 12px;
      }
      .ant-picker,
      .ant-select,
      .ant-input-number,
      .ant-input-affix-wrapper {
        flex: 0;
        flex-basis: 164px;
        width: 164px;
      }
      :deep(.ant-input-number-handler-wrap) {
        display: none;
      }
    }
    .ant-radio-group {
      .ant-radio-button-wrapper {
        border: 1px solid @borderColor;
        margin-left: 12px;
        &::before{
          display: none;
        }
      }
    }
    .ant-select.date-type {
      flex-basis: 132px;
    }
    .tilde {
      width: 30px;
      border-left: 0;
      border-right: 0;
      margin: 0;
      pointer-events: none;
      background-color: #fff;
      flex: 0 1 30px;
    }
    :deep(.ant-input-group) {
        width: auto;
        display: flex;
        .ant-picker {
            flex: 1;
            &:not(.ant-picker-focused):last-child {
                border-left-color: #fff;
            }
        }
        .ant-picker-focused {
            z-index: 1;
        }
    }
  }
}
</style>
