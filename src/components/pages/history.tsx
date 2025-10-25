import React, { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MessageCircle, Filter, RefreshCw, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

type ChatRecord = {
  id: string
  role: 'user' | 'assistant'
  message: string
  createdAt: string
}

const API_BASE = 'http://localhost:3000/api/history'

const History: React.FC = () => {
  const [records, setRecords] = useState<ChatRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [limit, setLimit] = useState(50)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  

  const loadHistory = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (userId.trim()) params.set('userId', userId.trim())
      params.set('limit', String(limit))
      params.set('offset', String(offset))

      const res = await fetch(`${API_BASE}?${params.toString()}`)
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error(`Unexpected response: ${res.status} ${res.statusText}`)
      }
      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || `Request failed with ${res.status}`)
      }
      setRecords(Array.isArray(data.data) ? data.data : [])
    } catch (err: any) {
      toast.error(`Failed to load history: ${err?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return records
    return records.filter(r => r.message.toLowerCase().includes(q))
  }, [records, search])

  const deleteById = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success) throw new Error(data?.message || `Failed (${res.status})`)
      toast.success('Message deleted')
      setRecords(prev => prev.filter(r => r.id !== id))
    } catch (err: any) {
      toast.error(`Delete failed: ${err?.message || 'Unknown error'}`)
    }
  }

  const deleteByUser = async () => {
    if (!userId.trim()) {
      toast('Enter a userId to bulk delete', { icon: '⚠️' })
      return
    }
    if (!confirm(`Delete all history for userId "${userId}"?`)) return
    try {
      const res = await fetch(`${API_BASE}?userId=${encodeURIComponent(userId.trim())}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success) throw new Error(data?.message || `Failed (${res.status})`)
      toast.success(`Deleted ${data.deleted || 0} messages`)
      // Reload current page
      loadHistory()
    } catch (err: any) {
      toast.error(`Bulk delete failed: ${err?.message || 'Unknown error'}`)
    }
  }

  const deleteAll = async () => {
    if (!confirm('Delete ALL chat history? This cannot be undone.')) return
    try {
      const res = await fetch(`${API_BASE}?all=true`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success) throw new Error(data?.message || `Failed (${res.status})`)
      toast.success(`Deleted ${data.deleted || 0} messages`)
      // Clear local list
      setRecords([])
    } catch (err: any) {
      toast.error(`Delete all failed: ${err?.message || 'Unknown error'}`)
    }
  }


  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-brand-soft shadow-sm flex-shrink-0">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-brand">History</h1>
                <p className="text-lg text-brand/70 font-medium">Browse past messages by topic</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-[#fafafa]">
        <div className="max-w-8xl mx-auto px-4 py-6 space-y-6">
          {/* Filter Bar */}
          <Card className="p-4 bg-white border border-brand shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-brand/70 mb-2">Search message</label>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search text..." className="border-brand text-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand/70 mb-2">User ID (optional)</label>
                <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="user-123" className="border-brand text-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand/70 mb-2">Limit</label>
                <Input type="number" min={1} max={200} value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border-brand text-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand/70 mb-2">Offset</label>
                <Input type="number" min={0} value={offset} onChange={(e) => setOffset(Number(e.target.value))} className="border-brand text-brand" />
              </div>
              <div className="md:col-span-5 flex gap-3 pt-1">
                <Button onClick={loadHistory} disabled={loading} className="bg-brand-gradient text-white hover:opacity-95">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
                  <span className="ml-2">Apply</span>
                </Button>
                <Button variant="outline" onClick={() => { setUserId(''); setOffset(0); setLimit(50); setSearch(''); loadHistory() }} className="text-brand border-brand">
                  Reset
                </Button>
                <Button variant="outline" onClick={deleteByUser} className="text-red-600 border-red-500 hover:bg-red-50 flex items-center">
                  <Trash2 className="w-4 h-4" />
                  <span className="ml-2">Delete by User</span>
                </Button>
                <Button variant="outline" onClick={deleteAll} className="text-red-700 border-red-600 hover:bg-red-50 flex items-center">
                  <Trash2 className="w-4 h-4" />
                  <span className="ml-2">Delete All</span>
                </Button>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" disabled={offset === 0 || loading} onClick={() => { setOffset(Math.max(0, offset - limit)); setTimeout(loadHistory, 0) }} className="text-brand border-brand">Prev</Button>
                  <Button variant="outline" disabled={loading || records.length < limit} onClick={() => { setOffset(offset + limit); setTimeout(loadHistory, 0) }} className="text-brand border-brand">Next</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Flat history list */}
          <Card className="p-0 bg-white border border-brand shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-brand bg-brand-soft flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand flex items-center"><MessageCircle className="w-5 h-5 mr-2" />Recent Messages</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-white border border-brand text-brand">{filtered.length} results</span>
            </div>
            <div className="p-4 space-y-2 min-h-[200px]">
              {loading && (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-xl bg-brand-soft border border-brand animate-pulse h-12" />
                  ))}
                </div>
              )}
              {!loading && filtered.length === 0 && (
                <p className="text-sm text-brand/70">No history found. Try adjusting filters.</p>
              )}
              {!loading && filtered.length > 0 && (
                <ul className="space-y-2">
                  {filtered.map((m) => (
                    <li key={m.id} className={`p-3 rounded-xl border ${m.role === 'user' ? 'bg-brand-gradient text-white border-brand' : 'bg-white text-brand border-brand'}`}>
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 pr-3">
                          <span className="text-xs font-semibold mr-2 uppercase tracking-wide">{m.role}</span>
                          <span className="text-sm align-middle">{m.message.length > 120 ? m.message.slice(0, 120) + '…' : m.message}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-brand/70 whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</span>
                          <button onClick={() => deleteById(m.id)} title="Delete message" className={`h-8 w-8 rounded-lg border flex items-center justify-center ${m.role === 'user' ? 'border-white/60 hover:bg-white/10' : 'border-red-500 text-red-600 hover:bg-red-50'}`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default History


