<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {getRequest} from "@/api";

const router = useRouter()

const tableData = ref([])
const getData = () => {
  getRequest('designList', {})
      .then(res => {
        tableData.value = res.data.list
      })
}
const toDetail = (id) => {
  router.push({path: '/show', query: {id: id}})
}
const toEdit = (id) => {
 // console.log(id)
 router.push({path: '/screen', query: {id: id}})
}
const addClick = () => {
  router.push({path: '/screen'})
}
onMounted(() => {
  getData()
})

</script>

<template>
<div class="list" style="margin: 10px">
  <div class="header-btn">
    <el-button type="primary" @click="addClick">新增大屏</el-button>
    <el-button type="danger">删除</el-button>
  </div>
  <div class="table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="creatDate" label="创建时间"/>

      <el-table-column>
        <template #default="scope">
          <el-button text type="primary" @click="toEdit(scope.row.id)">编辑</el-button>
          <el-button text type="primary" @click="toDetail(scope.row.id)">查看</el-button>
          <el-button text type="primary">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<style scoped>

</style>