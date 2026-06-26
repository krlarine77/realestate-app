import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// 未ログインのユーザーをログイン画面にリダイレクトするガードコンポーネント
export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // 初回マウント時にセッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // ログイン・ログアウト時にセッション状態を同期
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // セッション確認中はなにも表示しない
  if (session === undefined) return null

  // 未ログインならログイン画面へ
  if (!session) return <Navigate to="/login" replace />

  return children
}
