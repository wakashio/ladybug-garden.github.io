<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import VisualCalendar from '@/components/VisualCalendar.vue'
import html2canvas from 'html2canvas'
import { saveAuthorizationCodeFromUrl, fetchAccessToken, getCookie, TOKEN_KEY } from '@/auth/google'

const calendarRef = ref<HTMLElement | null>(null)
const token = ref<string | null>(getCookie(TOKEN_KEY))

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
onBeforeMount(() => {
  const currentUrl = window.location.href
  if (currentUrl.includes('code=')) {
    // 認証コードがある場合、処理を進める
    saveAuthorizationCodeFromUrl().then(() => {
      fetchAccessToken()
        .then(() => {
          console.log('reload')
          window.history.replaceState(null, '', window.location.pathname)
          location.reload() // トークン取得後にホームにリダイレクト
        })
        .catch(() => {
          console.error('Failed to fetch access token')
        })
    })
  }
  token.value = getCookie(TOKEN_KEY)
  if (!token.value) {
    fetchAccessToken().then(() => {
      token.value = getCookie(TOKEN_KEY)
    })
  } else {
  }
})
</script>

<template>
  <div v-if="token" class="flex gap">
    <!-- VisualCalendarコンポーネントをキャプチャするための参照 -->
    <div ref="calendarRef">
      <VisualCalendar />
    </div>

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
