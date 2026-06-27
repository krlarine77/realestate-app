import { useState, useEffect } from 'react'

// 物件の新規登録・編集に使うモーダルフォーム
// property が null なら新規登録、object なら編集モード
export default function PropertyModal({ isOpen, onClose, onSave, property }) {
  const [form, setForm] = useState({ name: '', rent: '', area: '', rooms: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // モーダルが開くたびにフォームを初期化
  useEffect(() => {
    if (!isOpen) return
    setError(null)
    if (property) {
      setForm({
        name:  property.name,
        rent:  property.rent,
        area:  property.area,
        rooms: property.rooms,
      })
    } else {
      setForm({ name: '', rent: '', area: '', rooms: '' })
    }
  }, [property, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSave({ ...form, rent: parseInt(form.rent, 10) })
    } catch (err) {
      setError('保存に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }

  return (
    // オーバーレイ背景。外側クリックで閉じる
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>
          {property ? '物件を編集' : '物件を登録'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>物件名</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="例：渋谷モダンアパート"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>家賃（円）</label>
            <input
              name="rent"
              type="number"
              value={form.rent}
              onChange={handleChange}
              style={styles.input}
              placeholder="例：150000"
              min="0"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>エリア</label>
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              style={styles.input}
              placeholder="例：東京都渋谷区"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>間取り</label>
            <input
              name="rooms"
              value={form.rooms}
              onChange={handleChange}
              style={styles.input}
              placeholder="例：1LDK"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={saving}
            >
              キャンセル
            </button>
            <button
              type="submit"
              style={styles.saveButton}
              disabled={saving}
            >
              {saving ? '保存中...' : '保存する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '1.5rem',
  },
  field: {
    marginBottom: '1.1rem',
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
    padding: '0.65rem 0.9rem',
    border: '1.5px solid #cbd5e0',
    borderRadius: '8px',
    fontSize: '1rem',
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
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  cancelButton: {
    padding: '0.65rem 1.25rem',
    backgroundColor: '#fff',
    color: '#4a5568',
    border: '1.5px solid #cbd5e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '0.65rem 1.5rem',
    backgroundColor: '#4299e1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
}
