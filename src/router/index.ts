import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'

// ルート定義
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (to.query.code) {
        // 認証コードがある場合、処理を進める
        import('../auth/google').then(({ saveAuthorizationCodeFromUrl, fetchAccessToken }) => {
          saveAuthorizationCodeFromUrl()
          fetchAccessToken()
            .then(() => {
              next({ name: 'Home' }) // トークン取得後にホームにリダイレクト
            })
            .catch(() => {
              console.error('Failed to fetch access token')
              next({ name: 'Home' }) // エラーハンドリング
            })
        })
      } else {
        next({ name: 'Home' }) // 認証コードがない場合はホームへ
      }
    }
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Home, // Callback用のダミーコンポーネントを設定
    beforeEnter: (to, from, next) => {
      if (to.query.code) {
        // 認証コードがある場合、処理を進める
        import('../auth/google').then(({ saveAuthorizationCodeFromUrl, fetchAccessToken }) => {
          saveAuthorizationCodeFromUrl()
          fetchAccessToken()
            .then(() => {
              next({ name: 'Home' }) // トークン取得後にホームにリダイレクト
            })
            .catch(() => {
              console.error('Failed to fetch access token')
              next({ name: 'Home' }) // エラーハンドリング
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
