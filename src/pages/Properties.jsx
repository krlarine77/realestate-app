import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import PropertyModal from '../components/PropertyModal'

export default function Properties() {
  const navigate = useNavigate()
  const [properties, setProperties]         = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)
  const [userEmail, setUserEmail]           = useState('')
  // モーダルの開閉と編集対象の管理
  const [modalOpen, setModalOpen]           = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  // 削除確認を表示する物件ID
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    // ログインユーザーのメールアドレスを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserEmail(session.user.email)
    })
    fetchProperties()
  }, [])

  // --- SELECT: 自分の物件一覧をSupabaseから取得 ---
  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました。')
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  // --- INSERT: 新規物件を登録 ---
  // --- UPDATE: 既存物件を更新 ---
  const handleSave = async (formData) => {
    if (editingProperty) {
      // 編集モード：対象IDの行を更新
      const { error } = await supabase
        .from('properties')
        .update(formData)
        .eq('id', editingProperty.id)
      if (error) throw error
    } else {
      // 新規モード：ログインユーザーのIDを付けて挿入
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('properties')
        .insert({ ...formData, user_id: user.id })
      if (error) throw error
    }
    setModalOpen(false)
    setEditingProperty(null)
    fetchProperties()
  }

  // --- DELETE: 物件を削除 ---
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    if (!error) {
      setConfirmDeleteId(null)
      fetchProperties()
    }
  }

  // 新規登録モーダルを開く
  const openAddModal = () => {
    setEditingProperty(null)
    setModalOpen(true)
  }

  // 編集モーダルを開く
  const openEditModal = (property) => {
    setEditingProperty(property)
    setModalOpen(true)
  }

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

      <main style={styles.main}>
        {/* ページヘッダー */}
        <div style={styles.pageHeader}>
          <div style={styles.pageHeaderLeft}>
            <h2 style={styles.pageTitle}>物件一覧</h2>
            {!loading && (
              <span style={styles.count}>{properties.length}件</span>
            )}
          </div>
          <button onClick={openAddModal} style={styles.addButton}>
            ＋ 物件を登録
          </button>
        </div>

        {/* ローディング */}
        {loading && (
          <p style={styles.stateText}>読み込み中...</p>
        )}

        {/* エラー */}
        {error && (
          <p style={styles.errorText}>{error}</p>
        )}

        {/* 物件が0件のとき */}
        {!loading && !error && properties.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🏠</p>
            <p style={styles.emptyText}>物件が登録されていません</p>
            <button onClick={openAddModal} style={styles.addButton}>
              最初の物件を登録する
            </button>
          </div>
        )}

        {/* 物件カードのグリッド */}
        {!loading && properties.length > 0 && (
          <div style={styles.grid}>
            {properties.map((property) => (
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

                  {/* 削除確認の表示切り替え */}
                  {confirmDeleteId === property.id ? (
                    <div style={styles.confirmArea}>
                      <p style={styles.confirmText}>本当に削除しますか？</p>
                      <div style={styles.confirmButtons}>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          style={styles.cancelSmallButton}
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          style={styles.deleteConfirmButton}
                        >
                          削除する
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.cardActions}>
                      <button
                        onClick={() => openEditModal(property)}
                        style={styles.editButton}
                      >
                        編集
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(property.id)}
                        style={styles.deleteButton}
                      >
                        削除
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新規登録・編集モーダル */}
      <PropertyModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingProperty(null)
        }}
        onSave={handleSave}
        property={editingProperty}
      />
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
  },
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  pageHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
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
  addButton: {
    padding: '0.6rem 1.25rem',
    backgroundColor: '#4299e1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  stateText: {
    textAlign: 'center',
    color: '#718096',
    padding: '3rem 0',
  },
  errorText: {
    textAlign: 'center',
    color: '#e53e3e',
    padding: '3rem 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 0',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyText: {
    color: '#718096',
    marginBottom: '1.5rem',
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
    marginBottom: '1.25rem',
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
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '1rem',
  },
  editButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#fff',
    color: '#4299e1',
    border: '1.5px solid #4299e1',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#fff',
    color: '#e53e3e',
    border: '1.5px solid #e53e3e',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  confirmArea: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '1rem',
  },
  confirmText: {
    fontSize: '0.875rem',
    color: '#e53e3e',
    marginBottom: '0.75rem',
    fontWeight: '600',
  },
  confirmButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  cancelSmallButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#fff',
    color: '#718096',
    border: '1.5px solid #cbd5e0',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteConfirmButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#e53e3e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
}
