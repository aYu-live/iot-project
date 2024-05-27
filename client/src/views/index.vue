<template>
    <div class="remark">
        <div class="title">备注</div>
        <div class="content">
            <a-textarea v-model:value="remark_content" placeholder="请填写备注" :rows="3" style="width:100%;"></a-textarea>
            <a-button class="add-remark" type="primary" @click="addRemark">添加备注</a-button>
            <div class="remark-item" v-for="remark in remarkList" :key="remark.id">
                <p><span style="font-weight: 600;">{{remark.staff_name}}</span>：{{remark.remark_content}}</p>
                <div class="action">
                    <p>{{remark.created_at}}<span style="margin-left: 20px;">备注于 {{remark.source_id_info}}</span></p>
                    <a @click="deleteRemark(remark.id)">删除</a>
                    <a @click="deleteRemark(remark.id)">操作</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { useRemark } from './hooks/index'
export default {
    setup () {
        const { remarkList, remark_content, addRemark, deleteRemark } = useRemark()
        return { remarkList, remark_content, addRemark, deleteRemark }
    }
}
</script>
<style lang="less" scoped>
.remark{
  margin: 20px auto;
  width: 450px;
  border: 1px solid @borderColor;
  min-height: 550px;
  .title{
    background: @backgroundColor_gray;
    border-bottom: 1px solid @borderColor;
    padding: 10px 20px;
  }
  .content{
    padding: 20px;
    display: flex;
    flex-direction: column;
    .add-remark{
      margin: 10px 0 20px;
      align-self: flex-end;
    }
    .remark-item{
      padding-top: 15px;
      &:first-of-type{
        border-top: 1px solid @borderColor;
      }
      border-bottom: 1px solid @borderColor;
      p{
        word-break: break-all;
      }
      .action{
        display: flex;
        justify-content: space-between;
        align-items: center;
        a{
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
