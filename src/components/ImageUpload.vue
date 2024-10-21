<script setup lang="ts">
import { ref } from 'vue'

// 画像のソースを管理
const imageSrc = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const scale = ref<number>(1) // 拡大縮小用の変数

// 画像の位置を管理
const position = ref<{ x: number; y: number }>({ x: 50, y: 50 }) // 背景画像の初期位置は中央 (50%, 50%)

// ドラッグ開始時の座標を管理
let startX = 0
let startY = 0
let initialX = 0
let initialY = 0

// 画像アップロード処理
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imageSrc.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

// クリックでアップロードを開始
const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click() // input[type="file"] をクリックしてアップロードを開始
  }
}

// ドラッグ開始処理
const startDragging = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()

  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY

  startX = clientX
  startY = clientY

  initialX = position.value.x
  initialY = position.value.y

  document.addEventListener('mousemove', dragImage)
  document.addEventListener('mouseup', stopDragging)
  document.addEventListener('touchmove', dragImage)
  document.addEventListener('touchend', stopDragging)
}

// 画像のドラッグ処理
const dragImage = (e: MouseEvent | TouchEvent) => {
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY

  const deltaX = -(clientX - startX)
  const deltaY = -(clientY - startY)

  // 背景画像の位置を更新
  position.value.x = Math.min(100, Math.max(0, initialX + (deltaX / window.innerWidth) * 100))
  position.value.y = Math.min(100, Math.max(0, initialY + (deltaY / window.innerHeight) * 100))
}

// ドラッグ終了時の処理
const stopDragging = () => {
  document.removeEventListener('mousemove', dragImage)
  document.removeEventListener('mouseup', stopDragging)
  document.removeEventListener('touchmove', dragImage)
  document.removeEventListener('touchend', stopDragging)
}

// ピンチイン・アウトやマウスホイールでの拡大縮小
const handleZoom = (event: WheelEvent | TouchEvent) => {
  event.preventDefault()

  if (event instanceof WheelEvent) {
    // マウスホイールのスクロールで拡大縮小
    const delta = event.deltaY > 0 ? -0.1 : 0.1
    scale.value = Math.max(0.1, scale.value + delta)
  } else if (event instanceof TouchEvent && event.touches.length === 2) {
    // ピンチイン・ピンチアウトの処理
    const [touch1, touch2] = event.touches
    const distance = Math.sqrt(
      (touch1.pageX - touch2.pageX) ** 2 + (touch1.pageY - touch2.pageY) ** 2
    )

    if (lastDistance.value) {
      const delta = (distance - lastDistance.value) / 200
      scale.value = Math.max(0.1, scale.value + delta)
    }
    lastDistance.value = distance
  }
}

// ピンチイン・アウト用の距離管理
const lastDistance = ref<number | null>(null)

// ピンチ操作終了時に距離リセット
const resetZoom = () => {
  lastDistance.value = null
}
</script>

<template>
  <div
    class="header"
    @dblclick="triggerFileUpload"
    @touchend.prevent="(e) => e.detail === 2 && triggerFileUpload()"
    @mousedown="startDragging"
    @touchstart="startDragging"
    @wheel="handleZoom"
    @touchmove="handleZoom"
    @touchend="resetZoom"
    :style="{
      backgroundImage: imageSrc ? `url(${imageSrc})` : '',
      backgroundSize: `${scale * 100}%` /* 画像のサイズをscaleに基づいて調整 */,
      backgroundPosition: `${position.x}% ${position.y}%` /* ドラッグで位置を調整 */,
      backgroundRepeat: 'no-repeat' /* 背景画像を繰り返さない */
    }"
  >
    <!-- slotでヘッダーのコンテンツを受け取る -->
    <slot></slot>

    <!-- 実際のファイル入力は表示しない -->
    <input
      type="file"
      accept="image/*"
      ref="fileInput"
      @change="handleFileUpload"
      style="display: none"
    />
  </div>
</template>

<style scoped>
.header {
  position: relative;
  width: 100%;
  min-height: 20vh;
  padding: 8px 10px;
  background-color: #c59785; /* デフォルトの背景色 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  cursor: pointer; /* クリック可能なエリアとして表示 */

  background-size: cover; /* アップロードされた画像をカバー表示 */
  background-position: center; /* 画像の位置を中央に */
  background-repeat: no-repeat; /* 背景画像の繰り返しを防ぐ */
  overflow: hidden; /* はみ出した部分を隠す */
}
</style>
