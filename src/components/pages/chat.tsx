import React, { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, User, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function ChatPage() {
  const { addToast } = useToast()
  
  // Load messages from localStorage or use default
  const loadMessages = (): Array<{ id: string, role: 'user' | 'assistant', content: string }> => {
    try {
      const saved = localStorage.getItem('chatMessages')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          // Validate that each message has the correct structure
          return parsed.filter((msg: any) => 
            msg && 
            typeof msg.id === 'string' && 
            (msg.role === 'user' || msg.role === 'assistant') && 
            typeof msg.content === 'string'
          )
        }
      }
    } catch (error) {
      console.warn('Failed to load chat messages from localStorage:', error)
    }
    return [{ id: 'm1', role: 'assistant' as const, content: 'Hi! How can I help you today?' }]
  }

  const [messages, setMessages] = useState<Array<{ id: string, role: 'user' | 'assistant', content: string }>>(loadMessages)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // Save messages to localStorage whenever messages change
  const saveMessages = (newMessages: Array<{ id: string, role: 'user' | 'assistant', content: string }>) => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(newMessages))
    } catch (error) {
      console.warn('Failed to save chat messages to localStorage:', error)
    }
  }

  // Force dark theme on mount (same behavior as login)
  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.body.classList.add('dark')
    return () => {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const userMessage = { id: crypto.randomUUID(), role: 'user' as const, content: text.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    saveMessages(newMessages)
    setText('')
    setSending(true)
    setIsTyping(true)

    try {
      const response = await fetch('http://localhost:3000/api/chat/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content })
      })

      const data = await response.json().catch(() => ({} as any))

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `Server error: ${response.status}`
        const error = new Error(errorMessage)
        ;(error as any).response = { data, status: response.status }
        throw error
      }

      const answer = (data as any)?.answer || "I'm here to help!"
      const finalMessages = [
        ...newMessages,
        { id: crypto.randomUUID(), role: 'assistant' as const, content: String(answer) }
      ]
      setMessages(finalMessages)
      saveMessages(finalMessages)
    } catch (err: any) {
      // Show detailed error in toaster
      const errorMessage = err?.message || 'Unknown error occurred'
      const errorDetails = err?.response?.data?.message || err?.response?.data?.error || errorMessage
      
      addToast({
        type: 'error',
        title: 'API Error',
        description: `Failed to get response: ${errorDetails}`,
        duration: 8000
      })
      
      const finalMessages = [
        ...newMessages,
        { id: crypto.randomUUID(), role: 'assistant' as const, content: `Sorry, I couldn't reach the tutor API. ${errorMessage}`.trim() }
      ]
      setMessages(finalMessages)
      saveMessages(finalMessages)
    } finally {
      setIsTyping(false)
      setSending(false)
    }
  }


  const clearChat = () => {
    const defaultMessages = [{ id: 'm1', role: 'assistant' as const, content: 'Hi! How can I help you today?' }]
    setMessages(defaultMessages)
    saveMessages(defaultMessages)
  }

  return (
    <div className="h-full bg-white flex flex-col">
      <style>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 12px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #2c3e50 0%, #2c3e50/80 50%, #2c3e50 100%);
          border-radius: 6px;
          border: 1px solid #2c3e50;
          box-shadow: 0 2px 4px rgba(44, 62, 80, 0.3);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2c3e50 0%, #2c3e50/60 30%, #2c3e50 100%);
          box-shadow: 0 4px 8px rgba(44, 62, 80, 0.5);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, #2c3e50 0%, #2c3e50/80 50%, #2c3e50 100%);
          box-shadow: 0 2px 4px rgba(44, 62, 80, 0.7);
        }
        .scrollbar-thin::-webkit-scrollbar-corner {
          background: #f8f9fa;
        }
        .prose-invert {
          color: #2c3e50 !important;
        }
        .prose-invert p {
          color: #2c3e50 !important;
        }
        .prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4, .prose-invert h5, .prose-invert h6 {
          color: #2c3e50 !important;
        }
        .prose-invert strong {
          color: #2c3e50 !important;
        }
        .prose-invert em {
          color: #2c3e50 !important;
        }
        .prose-invert li {
          color: #2c3e50 !important;
        }
        .prose-invert a {
          color: #2c3e50 !important;
        }
        .prose-invert * {
          color: #2c3e50 !important;
        }
        .prose-invert div {
          color: #2c3e50 !important;
        }
        .prose-invert span {
          color: #2c3e50 !important;
        }
        .prose-invert pre {
          background: #f8f9fa !important;
          border: 1px solid #e9ecef !important;
        }
        .prose-invert code {
          background: #f8f9fa !important;
          color: #2c3e50 !important;
        }
        .prose-invert pre code {
          background: transparent !important;
          color: #2c3e50 !important;
        }
        .hljs {
          background: #f8f9fa !important;
          color: #2c3e50 !important;
        }
        .hljs-comment, .hljs-quote {
          color: #6c757d !important;
        }
        .hljs-keyword, .hljs-selector-tag, .hljs-subst {
          color: #e83e8c !important;
        }
        .hljs-number, .hljs-literal, .hljs-variable, .hljs-template-variable, .hljs-tag .hljs-attr {
          color: #fd7e14 !important;
        }
        .hljs-string, .hljs-doctag {
          color: #20c997 !important;
        }
        .hljs-title, .hljs-section, .hljs-selector-id {
          color: #0d6efd !important;
        }
        .hljs-type, .hljs-class .hljs-title {
          color: #6f42c1 !important;
        }
        .hljs-tag, .hljs-name, .hljs-attribute {
          color: #dc3545 !important;
        }
        .hljs-regexp, .hljs-link {
          color: #20c997 !important;
        }
        .hljs-symbol, .hljs-bullet {
          color: #fd7e14 !important;
        }
        .hljs-built_in, .hljs-builtin-name {
          color: #0d6efd !important;
        }
        .hljs-meta {
          color: #6c757d !important;
        }
        .hljs-deletion {
          color: #dc3545 !important;
        }
        .hljs-addition {
          color: #20c997 !important;
        }
        .hljs-emphasis {
          color: #2c3e50 !important;
        }
        .hljs-strong {
          color: #2c3e50 !important;
        }
      `}</style>

      {/* Chat Header */}
      <div className="bg-brand-soft shadow-sm flex-shrink-0">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-brand">CodeMind Chat</h1>
                  <p className="text-sm text-black font-medium">Your AI Programming Assistant</p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={clearChat}
                variant="outline"
                className="text-black border border-brand hover:border-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white font-medium px-6 py-3"
                title="Clear chat history"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-[#fafafa]">
        <div className="max-w-8xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[60%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-brand-gradient' 
                      : 'bg-brand-soft'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-6 h-6 text-white" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-brand" />
                    )}
                  </div>

                  {/* Message */}
                  <div className={`px-6 py-5 rounded-2xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-brand-gradient text-white'
                      : 'bg-white text-gray-900 border border-brand'
                  }`}>
                    <div className={`text-sm leading-relaxed ${message.role === 'assistant' ? 'text-brand' : ''}`}>
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none prose-invert">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code: ({ node, className, children, ...props }: any) => {
                                const inline = !className?.includes('language-')
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                  <div className="my-3">
                                    <div className="rounded-t-lg px-3 py-1 text-xs text-brand border-b border-brand bg-[#f8f9fa]">
                                      {match[1]}
                                    </div>
                                    <pre className="rounded-b-lg p-3 overflow-x-auto text-sm bg-[#f8f9fa] border border-[#e9ecef]">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </pre>
                                  </div>
                                ) : (
                                  <code className="px-1.5 py-0.5 rounded text-xs font-mono text-brand bg-[#f8f9fa]" {...props}>
                                    {children}
                                  </code>
                                )
                              },
                              pre: ({ children }) => (
                                <div className="my-3">
                                  <div className="rounded-lg p-3 overflow-x-auto text-sm bg-[#f8f9fa] border border-[#e9ecef]">
                                    {children}
                                  </div>
                                </div>
                              ),
                              p: ({ children }) => <p className="mb-2 last:mb-0 text-brand">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2 text-brand">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-2 text-brand">{children}</ol>,
                              li: ({ children }) => <li className="text-sm text-brand">{children}</li>,
                              h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-brand">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-brand">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-brand">{children}</h3>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-brand pl-3 italic text-brand/80 my-2 bg-[#f8f9fa] py-2 rounded-r">
                                  {children}
                                </blockquote>
                              ),
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-4">
                                  <table className="min-w-full border-collapse border border-brand rounded-lg">
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border border-brand px-3 py-2 bg-[#f8f9fa] text-left font-semibold text-xs text-brand">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border border-brand px-3 py-2 text-xs text-brand">
                                  {children}
                                </td>
                              ),
                              strong: ({ children }) => <strong className="font-semibold text-brand">{children}</strong>,
                              em: ({ children }) => <em className="italic text-brand/80">{children}</em>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-brand" />
                  </div>
                  <div className="bg-white border border-brand px-5 py-4 rounded-2xl text-brand shadow-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-brand/80">Assistant is typing</span>
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-brand-soft">
        <div className="max-w-7xl mx-auto">
          <div className="p-6">
            <form onSubmit={handleSend} className="flex space-x-4">
              <div className="flex-1 relative">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ask me anything about the document..."
                  className="w-full px-6 py-6 pr-16 bg-white border border-brand text-brand placeholder:text-brand/60 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand shadow-sm font-medium"
                />
                <Send className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-brand" />
              </div>
              <Button
                type="submit"
                disabled={sending || !text.trim()}
                className="px-10 py-6 bg-brand-gradient hover:opacity-95 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
              >
                {sending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-xl font-medium">Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-medium">Send</span>
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage


