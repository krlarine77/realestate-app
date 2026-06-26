import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// ダミー物件データ
const PROPERTIES = [
  { id: 1, name: '渋谷モダンアパート',         rent: 150000, area: '東京都渋谷区',  rooms: '1LDK' },
  { id: 2, name: '新宿タワーマンション',        rent: 280000, area: '東京都新宿区',  rooms: '2LDK' },
  { id: 3, name: '池袋リゾートヴィラ',          rent: 95000,  area: '東京都豊島区',  rooms: '1K'   },
  { id: 4, name: '品川シーサイドレジデンス',    rent: 220000, area: '東京都品川区',  rooms: '2LDK' },
  { id: 5, name: '恵比寿ガーデンハウス',        rent: 180000, area: '東京都渋谷区',  rooms: '1LDK' },
  { id: 6, name: '六本木ルーフトップスイート',  rent: 350000, area: '東京都港区',    rooms: '3LDK' },
]

export default function Properties() {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // ログイン中のユーザーのメールアドレスを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserEmail(session.user.email)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={styles.page}>
      {/* ヘッダー */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={styles.headerTitle}>🏠 不動産管理システム</h1>
          <div style={styles.headerRight}>
            <span style={styles.email}>{userEmail}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main style={styles.main}>
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>物件一覧</h2>
          <span style={styles.count}>{PROPERTIES.length}件</span>
        </div>

        <div style={styles.grid}>
          {PROPERTIES.map((property) => (
            <div key={property.id} style={styles.card}>
              <div style={styles.cardImage}>🏢</div>
              <div style={styles.cardBody}>
                <h3 style={styles.propertyName}>{property.name}</h3>
                <div style={styles.badge}>{property.rooms}</div>
                <div style={styles.infoList}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>家賃</span>
                    <span style={styles.infoValue}>
                      ¥{property.rent.toLocaleString()}
                      <span style={styles.perMonth}>/月</span>
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>エリア</span>
                    <span style={styles.infoValue}>{property.area}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  email: {
    fontSize: '0.875rem',
    color: '#718096',
  },
  logoutButton: {
    padding: '0.45rem 1rem',
    backgroundColor: '#fff',
    color: '#e53e3e',
    border: '1.5px solid #e53e3e',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a202c',
  },
  count: {
    fontSize: '0.875rem',
    color: '#718096',
    backgroundColor: '#e2e8f0',
    padding: '0.2rem 0.6rem',
    borderRadius: '99px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardImage: {
    backgroundColor: '#ebf4ff',
    fontSize: '3rem',
    textAlign: 'center',
    padding: '1.5rem 0',
  },
  cardBody: {
    padding: '1.25rem',
  },
  propertyName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '0.5rem',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#ebf4ff',
    color: '#2b6cb0',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.2rem 0.6rem',
    borderRadius: '99px',
    marginBottom: '1rem',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
  },
  infoLabel: {
    color: '#718096',
    fontWeight: '500',
  },
  infoValue: {
    color: '#1a202c',
    fontWeight: '600',
  },
  perMonth: {
    fontSize: '0.75rem',
    fontWeight: '400',
    color: '#718096',
  },
}
