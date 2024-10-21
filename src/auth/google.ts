const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET
const REDIRECT_URI = import.meta.env.REDIRECT_URI // Google Cloud Consoleで設定したリダイレクトURI
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly'
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_KEY = 'google_access_token' // クッキーでトークンを保存するキー
const CODE_KEY = 'google_authorization_code' // クッキーで認証コードを保存するキー

/**
 * クッキーに保存する関数
 */
const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

/**
 * クッキーから取得する関数
 */
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

/**
 * クッキーを削除する関数
 */
const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

/**
 * Googleの認証ページにリダイレクトする関数
 */
export const redirectToGoogleAuth = () => {
  const userConfirmed = confirm('Googleの認証ページに移動しますか？')
  if (userConfirmed) {
    const authUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`
    window.location.href = authUrl
  } else {
    console.log('ユーザーはリダイレクトをキャンセルしました')
  }
}

/**
 * リダイレクト後、authorization code をURLから取得し、クッキーに保存する関数
 */
export const saveAuthorizationCodeFromUrl = (): void => {
  const urlParams = new URLSearchParams(window.location.search) // URLのクエリパラメータを取得
  const authorizationCode = urlParams.get('code')
  if (authorizationCode) {
    setCookie(CODE_KEY, authorizationCode, 1) // 認証コードをクッキーに保存 (1日有効)
    window.history.replaceState(null, '', window.location.pathname) // URLクエリパラメータをクリア
  }
}

/**
 * クッキーからアクセストークンを取得する関数
 * トークンが存在しない場合は再取得のためにリダイレクトし、エラーを出力
 */
export const getAccessTokenFromCookie = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    const accessToken = getCookie(TOKEN_KEY)
    if (!accessToken) {
      const currentUrl = window.location.href
      if (!currentUrl.includes('code=')) {
        console.error('アクセストークンが見つかりません。Google認証ページにリダイレクトします。')
        redirectToGoogleAuth() // トークンがない場合はGoogleの認証ページにリダイレクト
      }
      resolve(null) // トークンがない場合は null を返す
    } else {
      resolve(accessToken) // トークンがある場合はそれを返す
    }
  })
}
/**
 * authorization code からアクセストークンを取得する関数
 */
export const fetchAccessToken = async (): Promise<void> => {
  const authorizationCode = getCookie(CODE_KEY)
  if (!authorizationCode) {
    console.error('認証コードが見つかりません。Google認証ページにリダイレクトします。')
    redirectToGoogleAuth() // 認証コードがない場合は再認証
    return
  }

  try {
    // Authorization Code を使ってアクセストークンを取得するためのリクエスト
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code: authorizationCode,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    })

    const data = await response.json()

    if (data.access_token) {
      setCookie(TOKEN_KEY, data.access_token, 1) // アクセストークンをクッキーに保存 (1日有効)
      console.log('setCookie')
    } else {
      console.error('アクセストークンの取得に失敗しました', data)
      redirectToGoogleAuth() // アクセストークンが取れなかったら再認証
    }
  } catch (error) {
    console.error('アクセストークンの取得エラー', error)
    redirectToGoogleAuth() // エラー時には再認証
  }
}

/**
 * ログアウト時やトークンが無効になった場合、クッキーを削除する関数
 */
export const clearAccessToken = (): void => {
  deleteCookie(TOKEN_KEY)
  deleteCookie(CODE_KEY)
}
