<template>
  <div :style="screenStyle" class="design-canvas">
    <a-screen v-for="(element, index) in screenData.list" :key="index" :data="getReplaceGlobal(element)" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AScreen from './screen/components/screen.vue'
import { getReplaceGlobal } from './screen/getData'
import {
  stringToObj,
  appendOrRemoveStyle,
} from '@/utils/design'
import { requestResponse } from '@/utils/requestResponse'
import json from './id40.json'

const route = useRoute()
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
  const resultData = stringToObj(json.data.data)
  const optionList = stringToObj(json.data.optionList)
  resultData.list?.forEach((item: any) => {
    if (['line', 'bar', 'pie', 'echarts'].includes(item.type) && item.key) {
      item.option = optionList[item.key] || {}
    }
  })

  if (resultData.config?.style) {
    appendOrRemoveStyle('screenStyle', resultData.config.style, true)
  }

  const { requestUrl, beforeFetch, afterFetch, method } = resultData.config;

  requestResponse({
    requestUrl,
    beforeFetch,
    afterFetch,
    route,
    params: {},
    options: { method: method }
  }).then((res: any) => {
    window.getScreenGlobal = res.data
    screenData.value = resultData
    console.log(123, resultData);
  })


  // getInitData(route.query.id)
  //   .then((res: any) => {
  //     loading.value = false
  //     screenData.value = res.screenData
  //   })
  //   .catch(res => {
  //     if (res?.screenData) {
  //       //一个请求成功进
  //       screenData.value = res.screenData
  //     }
  //     loading.value = false
  //   })
}
onMounted(() => {
  getData()
})
</script>
