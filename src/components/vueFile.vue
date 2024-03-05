<template>
  <el-dialog
    v-model="visible"
    title="导出vue文件"
    class="export-dialog"
    width="80%"
  >
    <div id="editJsonCopy"></div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="copyData"> 复制数据 </el-button>
        <el-button type="primary" @click="dialogExport"> 导出代码 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue'
  import Clipboard from 'clipboard'
  import { ElMessage } from 'element-plus'
  import { aceEdit, objToStringify } from '@/utils/design'

  const visible = ref(false)
  const editor = ref()
  // 根据生成的json提取需要导入的组件，远程方法，检验方法

  const openScreen = (obj: any) => {
    visible.value = true
    let styleCss = ''
    let globalData = ''
    let globalImport = ''
    const style = obj.config.style
    if (style) {
      styleCss = `<style>${style}
<\/style>`
    }
    if (obj.config.requestUrl) {
      // 全局大屏数据
      globalImport = `import { getRequest } from '@/api'`
      globalData = `
      const {requestUrl,method} = screenData.value.config
  getRequest(requestUrl,{},{method:method})
  .then((res: any) => {
      // 这里处理数据，直接对screenData设置值即可，无须使用全局或afterFetch之类的方法设值
      //
   })`
    }
    const html = `<template>
  <div :style="screenStyle" class="design-canvas">
    <ak-screen
      v-for="(element, index) in screenData.list"
      :key="index"
      :data="element"
    ></ak-screen>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, provide } from 'vue'
  ${globalImport}
  import AKScreen from '@/views/screen/components/screen.vue' //可根据需求是否全局注册
  const loading = ref(true)
  const screenData = ref(${objToStringify(obj)})
  const screenStyle = computed(() => {
    const { width, height, background, primary } = screenData.value.config
    return {
      width: width,
      height: height,
      background: background,
      color: primary,
      position: 'relative'
    }
  })
  ${globalData}
<\/script>
${styleCss}`
    nextTick(() => {
      editor.value = aceEdit(html, 'editJsonCopy', 'html')
    })
  }

  const copyData = (e: any) => {
    nextTick(() => {
      const clipboard: any = new Clipboard(e.target, {
        text: () => {
          return editor.value.getValue()
        }
      })
      clipboard.on('success', function () {
        ElMessage({
          message: '复制成功！',
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', function () {
        ElMessage.error('复制失败')
        clipboard.destroy()
      })
      clipboard.onClick(e)
    })
  }
  // 导出文件
  const dialogExport = () => {
    const content = 'data:text/csv;charset=utf-8,' + editor.value?.getValue()
    const fileName = new Date().getTime() + '.vue'
    const encodedUri = encodeURI(content)
    const actions = document.createElement('a')
    actions.setAttribute('href', encodedUri)
    actions.setAttribute('download', fileName)
    actions.click()
  }
  defineExpose({
    openScreen
  })
</script>
