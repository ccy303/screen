<template>
<div :style="screenStyle" class="design-canvas">
  <a-screen
      v-for="(element, index) in screenData.list"
      :key="index"
      :data="getReplaceGlobal(element)"
  />
</div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AScreen from './screen/components/screen.vue'
import { getInitData, getReplaceGlobal } from './screen/getData'

const route = useRoute()
const loading = ref(true)
const screenData = ref({ list: [], config: {} })
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
const getData = () => {
  getInitData(route.query.id)
      .then((res: any) => {
        loading.value = false
        screenData.value = res.screenData
      })
      .catch(res => {
        if (res?.screenData) {
          //一个请求成功进
          screenData.value = res.screenData
        }
        loading.value = false
      })
}
onMounted(() => {
  getData()
})
</script>
