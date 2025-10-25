import React, { useEffect, useState } from 'react'
import { MessageCircle, Bot, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUserMessages: 0,
    totalAssistantMessages: 0,
    avgResponseTime: 0,
    totalSessions: 0,
    totalDocuments: 0
  })
  const [recentDocuments, setRecentDocuments] = useState<Array<{ id: string; title: string; createdAt: string; type: string }>>([])
  const [recentMessages, setRecentMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([])

  // Load stats from localStorage
  useEffect(() => {
    const loadStats = () => {
      try {
        const messages = localStorage.getItem('chatMessages')
        const sessions = localStorage.getItem('chatSessions')
        
        if (messages) {
          const parsedMessages = JSON.parse(messages)
          const totalUserMessages = parsedMessages.filter((m: any) => m?.role === 'user').length
          const totalAssistantMessages = parsedMessages.filter((m: any) => m?.role === 'assistant').length

          setStats(prev => ({
            ...prev,
            totalUserMessages,
            totalAssistantMessages
          }))
        }

        if (sessions) {
          const parsedSessions = JSON.parse(sessions)
          setStats(prev => ({
            ...prev,
            totalSessions: parsedSessions.length
          }))
        }

        const savedDocuments = localStorage.getItem('savedDocuments')
        if (savedDocuments) {
          const parsedDocs = JSON.parse(savedDocuments)
          if (Array.isArray(parsedDocs)) {
            setStats(prev => ({
              ...prev,
              totalDocuments: parsedDocs.length
            }))
            // sort by createdAt desc if present
            const docsSorted = [...parsedDocs].sort((a: any, b: any) => {
              const ad = new Date(a.createdAt || 0).getTime()
              const bd = new Date(b.createdAt || 0).getTime()
              return bd - ad
            })
            setRecentDocuments(docsSorted.slice(0, 3).map((d: any) => ({
              id: String(d.id ?? Math.random()),
              title: String(d.title ?? d.fileName ?? 'Untitled'),
              createdAt: String(d.createdAt ?? ''),
              type: String(d.type ?? 'uploaded')
            })))
          }
        }

        // collect last messages for preview (max 3)
        if (messages) {
          const parsedMessages = JSON.parse(messages)
          if (Array.isArray(parsedMessages)) {
            const last = parsedMessages.slice(-3)
            setRecentMessages(last)
          }
        }
      } catch (error) {
        console.warn('Failed to load dashboard stats:', error)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: 'Total User Messages',
      value: stats.totalUserMessages,
      icon: MessageCircle,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Total Assistant Messages',
      value: stats.totalAssistantMessages,
      icon: Bot,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Total Documents',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/30'
    },
  ]

  // reserved for future topics module

  return (
    <div className="h-full bg-white flex flex-col">
      <style>{`
        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2c3e50;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #34495e;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
      `}</style>
      {/* Header */}
      <div className="bg-brand-soft shadow-sm flex-shrink-0">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-brand">Dashboard</h1>
                <p className="text-lg text-brand/70 font-medium">Welcome back! Here's your activity overview.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-[#fafafa] custom-scrollbar">
        <div className="max-w-8xl mx-auto px-4 py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="p-6 bg-white border border-brand shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brand/70 mb-2">{stat.title}</p>
                      <p className="text-4xl font-bold text-brand">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm bg-brand-gradient`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Data Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Documents */}
            <Card className="p-6 bg-white border border-brand shadow-sm">
              <h3 className="text-xl font-bold text-brand mb-4">Recent Documents</h3>
              {recentDocuments.length === 0 ? (
                <p className="text-sm text-brand/70">No documents yet. Upload some files on the Documents page.</p>
              ) : (
                <ul className="divide-y divide-brand/20">
                  {recentDocuments.map((doc) => (
                    <li key={doc.id} className="py-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-brand truncate">{doc.title}</p>
                        <p className="text-xs text-brand/70">{new Date(doc.createdAt).toLocaleDateString()} • {doc.type}</p>
                      </div>
                      <button onClick={() => navigate('/app/documents')} className="px-3 py-1 text-xs rounded-full bg-brand-soft text-brand border border-brand hover:opacity-95">
                        Open
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Recent Messages */}
            <Card className="p-6 bg-white border border-brand shadow-sm">
              <h3 className="text-xl font-bold text-brand mb-4">Recent Messages</h3>
              {recentMessages.length === 0 ? (
                <p className="text-sm text-brand/70">No chat messages yet. Start a chat to see activity.</p>
              ) : (
                <ul className="space-y-2">
                  {recentMessages.map((m) => (
                    <li key={m.id} className={`p-2 rounded-xl border ${m.role === 'user' ? 'bg-brand-soft border-brand text-brand' : 'bg-white border-brand text-brand'}`}>
                      <span className="text-xs font-semibold mr-2 uppercase tracking-wide">{m.role}</span>
                      <span className="text-sm align-middle">{m.content.length > 80 ? m.content.slice(0, 80) + '…' : m.content}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6 p-6 bg-white border border-brand shadow-sm">
            <h3 className="text-xl font-bold text-brand mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button className="p-6 bg-brand-soft rounded-xl hover:opacity-95 transition-all duration-200 text-left shadow-sm hover:shadow-md" onClick={() => navigate('/app/chat')}>
                <MessageCircle className="w-8 h-8 text-brand mb-3" />
                <p className="text-lg font-bold text-brand">Start New Chat</p>
                <p className="text-sm text-brand/70">Begin a conversation</p>
              </button>
              <button className="p-6 bg-brand-soft rounded-xl hover:opacity-95 transition-all duration-200 text-left shadow-sm hover:shadow-md" onClick={() => navigate('/app/documents')} >
                <FileText className="w-8 h-8 text-brand mb-3" />
                <p className="text-lg font-bold text-brand">View Documents</p>
                <p className="text-sm text-brand/70">Browse saved chats</p>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
