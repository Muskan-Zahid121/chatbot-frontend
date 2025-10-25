import React, { useState, useEffect } from 'react'
import { FileText, Search, Filter, Download, Trash2, Eye, Calendar, MessageCircle, Upload, File, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

interface Document {
  id: string
  title: string
  content: string
  createdAt: string
  messageCount: number
  lastActivity: string
  tags: string[]
  type: 'conversation' | 'uploaded'
  fileSize?: string
  fileName?: string
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTag, setFilterTag] = useState('all')
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loadDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/documents')
      
      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Server returned HTML instead of JSON. Backend server may not be running.')
      }

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const formattedDocs: Document[] = result.documents.map((doc: any) => ({
            id: doc.id,
            title: doc.title,
            content: `Document: ${doc.fileName || doc.title}`,
            createdAt: doc.createdAt.split('T')[0],
            messageCount: 0,
            lastActivity: 'Recently uploaded',
            tags: [doc.fileType?.toUpperCase() || 'DOCUMENT', 'Uploaded'],
            type: 'uploaded',
            fileSize: 'Unknown',
            fileName: doc.fileName || doc.title
          }))
          setDocuments(formattedDocs)
          localStorage.setItem('savedDocuments', JSON.stringify(formattedDocs))
        }
      } else {
        throw new Error(`API request failed with status ${response.status}`)
      }
    } catch (error: any) {
      console.warn('Failed to load documents from API:', error)
      
      // Show error in toaster
      toast.error(error?.message || 'Unable to connect to the backend server. Using cached data.')
      
      // Fallback to localStorage
      const saved = localStorage.getItem('savedDocuments')
      if (saved) {
        setDocuments(JSON.parse(saved))
      } else {
        // Show a helpful message if no data is available
        toast('No cached documents found. Please ensure the backend server is running and try uploading a file.', { icon: '⚠️' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterTag === 'all' || doc.tags.includes(filterTag)
    return matchesSearch && matchesFilter
  })

  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)))

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Refresh the documents list from API
          await loadDocuments()
          toast.success('Document deleted')
        }
      } else {
        const errorData = await response.json()
        toast.error(`Failed to delete document: ${errorData.message}`)
      }
    } catch (error: any) {
      console.error('Delete failed:', error)
      toast.error(`Failed to delete document: ${error?.message || 'Unknown error'}`)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    
    try {
      for (const file of Array.from(files)) {
        // Try API upload first
        try {
          const formData = new FormData()
          formData.append('document', file)
          formData.append('title', file.name)

          const response = await fetch('http://localhost:3000/api/documents/upload', {
            method: 'POST',
            body: formData,
          })

          // Check if response is HTML (error page)
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('text/html')) {
            throw new Error('Backend server not available')
          }

          if (!response.ok) {
            let errorMessage = `Upload failed with status ${response.status}`
            try {
              const errorData = await response.json()
              errorMessage = errorData.message || errorMessage
            } catch (jsonError) {
              errorMessage = response.statusText || errorMessage
            }
            throw new Error(errorMessage)
          }

          let result
          try {
            result = await response.json()
          } catch (jsonError) {
            throw new Error('Server returned invalid JSON response')
          }
          
          if (result.success) {
            // Refresh the documents list from API
            await loadDocuments()
            toast.success(`${file.name} uploaded successfully`)
            return
          } else {
            // Handle specific error messages
            const errorMsg = result.message || 'Upload failed'
            if (errorMsg.includes('PDF parsing not implemented')) {
              throw new Error('PDF files are not supported yet. Please use .txt or .md files.')
            }
            throw new Error(errorMsg)
          }
        } catch (apiError) {
          console.warn('API upload failed, using fallback:', apiError)
          
          // Fallback: Create local document entry
          const newDoc: Document = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: file.name,
            content: `Uploaded file: ${file.name} (Local storage - Backend not available)`,
            createdAt: new Date().toISOString().split('T')[0],
            messageCount: 0,
            lastActivity: 'Just now',
            tags: [file.type.split('/')[1]?.toUpperCase() || 'FILE', 'Uploaded', 'Local'],
            type: 'uploaded',
            fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            fileName: file.name
          }
          
          setDocuments(prev => {
            const updated = [newDoc, ...prev]
            localStorage.setItem('savedDocuments', JSON.stringify(updated))
            return updated
          })
          
          toast(`${file.name} uploaded to local storage. Backend server is not available.`, { icon: '⚠️' })
        }
      }
    } catch (error: any) {
      console.error('Upload failed:', error)
      toast.error(`Failed to upload file: ${error?.message || 'Unknown error'}`)
    } finally {
      setIsUploading(false)
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
                <h1 className="text-3xl font-bold text-brand">Documents</h1>
                <p className="text-lg text-brand/70 font-medium">Your saved conversations and files</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={loadDocuments}
                disabled={isLoading}
                variant="outline"
                className="text-brand border-brand hover:bg-brand-soft font-medium"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".txt,.md,.pdf"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center space-x-2 px-6 py-3 bg-brand-gradient text-white rounded-xl hover:opacity-95 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer font-medium"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                <span>{isUploading ? 'Uploading...' : 'Upload Files (.txt, .md, .pdf)'}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#2c3e50]/5 to-white">
        <div className="max-w-8xl mx-auto px-4 py-6">
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2c3e50]/60" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-white border border-[#2c3e50] text-[#2c3e50] focus:ring-[#2c3e50] focus:border-[#2c3e50] rounded-xl h-12"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-[#2c3e50]" />
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="px-4 py-3 bg-white border border-[#2c3e50] text-[#2c3e50] rounded-xl focus:ring-[#2c3e50] focus:border-[#2c3e50] h-12 font-medium"
                >
                  <option value="all">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          {isLoading && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="p-6 bg-white border border-[#2c3e50]/20 shadow-sm rounded-xl animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#2c3e50]/10" />
                      <div className="flex-1 min-w-0">
                        <div className="h-5 bg-[#2c3e50]/10 rounded w-2/3 mb-2" />
                        <div className="h-4 bg-[#2c3e50]/10 rounded w-full mb-1" />
                        <div className="h-4 bg-[#2c3e50]/10 rounded w-5/6" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-5 w-16 bg-[#2c3e50]/10 rounded-full" />
                    <div className="h-5 w-20 bg-[#2c3e50]/10 rounded-full" />
                    <div className="h-5 w-14 bg-[#2c3e50]/10 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#2c3e50]/60 mb-4">
                    <div className="h-4 w-24 bg-[#2c3e50]/10 rounded" />
                    <div className="h-4 w-20 bg-[#2c3e50]/10 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 bg-[#2c3e50]/10 rounded" />
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-[#2c3e50]/10 rounded" />
                      <div className="h-8 w-8 bg-[#2c3e50]/10 rounded" />
                      <div className="h-8 w-8 bg-[#2c3e50]/10 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="p-6 bg-white border border-[#2c3e50]/20 shadow-sm hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                        doc.type === 'uploaded' 
                          ? 'bg-gradient-to-r from-[#2c3e50]/10 to-[#2c3e50]/5' 
                          : 'bg-[#2c3e50]'
                      }`}>
                        {doc.type === 'uploaded' ? (
                          <File className="w-6 h-6 text-brand" />
                        ) : (
                          <MessageCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-brand mb-2 truncate">{doc.title}</h3>
                        <p className="text-sm text-[#2c3e50]/70 line-clamp-2">{doc.content}</p>
                      </div>
                    </div>
                  </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {doc.tags.map((tag, index) => (
                      <span
                        key={index}
                      className="px-3 py-1 bg-brand-soft border border-brand text-brand text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#2c3e50]/60 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                    {doc.type === 'conversation' ? (
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">{doc.messageCount} messages</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <File className="w-4 h-4" />
                        <span className="font-medium">{doc.fileSize}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#2c3e50]/60 font-medium">
                      Last activity: {doc.lastActivity}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#2c3e50] border-[#2c3e50] hover:border-[#2c3e50] hover:bg-[#2c3e50]/10 h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#2c3e50] border-[#2c3e50] hover:border-[#2c3e50] hover:bg-[#2c3e50]/10 h-8 w-8 p-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-500 border-red-500 hover:border-red-500 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && filteredDocuments.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-[#2c3e50]/10 to-[#2c3e50]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-[#2c3e50]" />
              </div>
              <h3 className="text-xl font-bold text-[#2c3e50] mb-3">No documents found</h3>
              <p className="text-[#2c3e50]/70 text-lg">
                Try uploading files or ensure the backend server is running.
              </p>
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-[#2c3e50]/10 to-[#2c3e50]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-[#2c3e50]" />
              </div>
              <h3 className="text-xl font-bold text-[#2c3e50] mb-3">No documents found</h3>
              <p className="text-[#2c3e50]/70 text-lg">
                {searchTerm || filterTag !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload files or start a conversation to create your first document'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Documents
