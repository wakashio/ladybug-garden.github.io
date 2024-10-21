import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import { fetchAccessToken, saveAuthorizationCodeFromUrl } from '@/auth/google'

// ルート定義
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Home, // Callback用のダミーコンポーネントを設定
    beforeEnter: (to, from, next) => {
      if (to.query.code) {
        // 認証コードがある場合、処理を進める
        saveAuthorizationCodeFromUrl().then(() => {
          fetchAccessToken()
            .then(() => {
              location.reload()
            })
            .catch(() => {
              console.error('Failed to fetch access token')
            })
        })
      } else {
        next({ name: 'Home' }) // 認証コードがない場合はホームへ
      }
    }
  }
]

// Vue Router のインスタンスを作成
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
