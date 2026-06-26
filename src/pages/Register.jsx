import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    // パスワード一致チェック
    if (password !== confirm) {
      setError('パスワードが一致しません')
      return
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(translateError(error.message))
    } else {
      // Supabaseのメール確認が不要な設定の場合はそのまま遷移
      setMessage('登録が完了しました。確認メールをご確認ください。')
      setTimeout(() => navigate('/login'), 3000)
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span style={styles.logo}>🏠</span>
          <h1 style={styles.title}>会員登録</h1>
          <p style={styles.subtitle}>不動産管理システム</p>
        </div>

        <form onSubmit={handleRegister}>
          <div style={styles.field}>
            <label style={styles.label}>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="example@email.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>パスワード（6文字以上）</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="パスワードを入力"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>パスワード（確認）</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={styles.input}
              placeholder="もう一度入力"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '登録中...' : '会員登録'}
          </button>
        </form>

        <p style={styles.linkText}>
          すでにアカウントをお持ちの方は{' '}
          <Link to="/login" style={styles.anchor}>ログイン</Link>
        </p>
      </div>
    </div>
  )
}

function translateError(message) {
  if (message.includes('User already registered')) return 'このメールアドレスはすでに登録されています'
  if (message.includes('Password should be at least')) return 'パスワードは6文字以上で入力してください'
  if (message.includes('Unable to validate email')) return '有効なメールアドレスを入力してください'
  return message
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    fontSize: '2.5rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1a202c',
    marginTop: '0.5rem',
  },
  subtitle: {
    color: '#718096',
    fontSize: '0.9rem',
    marginTop: '0.25rem',
  },
  field: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    color: '#4a5568',
  },
  input: {
    width: '100%',
    padding: '0.7rem 1rem',
    border: '1.5px solid #cbd5e0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
  },
  error: {
    color: '#e53e3e',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    padding: '0.6rem 0.9rem',
    backgroundColor: '#fff5f5',
    borderRadius: '8px',
    border: '1px solid #feb2b2',
  },
  success: {
    color: '#276749',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    padding: '0.6rem 0.9rem',
    backgroundColor: '#f0fff4',
    borderRadius: '8px',
    border: '1px solid #9ae6b4',
  },
  button: {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: '#48bb78',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.875rem',
    color: '#718096',
  },
  anchor: {
    color: '#4299e1',
    textDecoration: 'none',
    fontWeight: '600',
  },
}
