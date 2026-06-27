import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// 未ログインのユーザーをログイン画面にリダイレクトするガードコンポーネント
export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // 初回マウント時にセッション取得（デバッグ用ログあり）
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        console.log('[ProtectedRoute] session:', session)
        console.log('[ProtectedRoute] user email:', session?.user?.email)
        setSession(session)
      })
      .catch((err) => {
        console.error('[ProtectedRoute] getSession error:', err)
        setSession(null)
      })

    // ログイン・ログアウト時にセッション状態を同期
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[ProtectedRoute] onAuthStateChange session:', session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // セッション確認中はなにも表示しない
  if (session === undefined) return null

  // メールアドレスで認証済みのユーザーのみ通過させる
  const isAuthenticated = session?.user?.email != null
  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}
