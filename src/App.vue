<script setup lang="ts">
import { ref } from 'vue'
import VisualCalendar from './components/VisualCalendar.vue'
import html2canvas from 'html2canvas'

const calendarRef = ref<HTMLElement | null>(null)

// 画像として保存する関数
const saveAsImage = () => {
  if (calendarRef.value) {
    html2canvas(calendarRef.value).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = imgData
      link.download = 'calendar.png'
      link.click()
    })
  }
}
</script>

<template>
  <div class="flex gap">
    <!-- VisualCalendarコンポーネントをキャプチャするための参照 -->
    <div ref="calendarRef">
      <VisualCalendar />
    </div>

    <!-- <img src="./assets/calendar_design.png" class="logo" /> -->

    <!-- 画像として保存するボタン -->
    <button @click="saveAsImage">画像として保存</button>
  </div>
</template>

<style scoped lang="scss">
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px;
  gap: 10px;
  font-family: 'Barlow Condensed';
}

.logo {
  max-height: 80vh;
}

button {
  padding: 8px 12px;
  font-size: 14px;
  background-color: #c59785;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #b5836d;
  }
}
</style>
