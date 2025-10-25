import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  MessageCircle, 
  LayoutDashboard, 
  FileText, 
  LogOut,
  Bot,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  onLogout: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation()

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/app/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      name: 'Chat',
      href: '/app/chat',
      icon: MessageCircle,
      description: 'AI Assistant Chat'
    },
    {
      name: 'Documents',
      href: '/app/documents',
      icon: FileText,
      description: 'Saved conversations'
    },
    {
      name: 'History',
      href: '/app/history',
      icon: MessageCircle,
      description: 'Browse chat history'
    },
    {
        name: 'Profile',
        href: '/app/profile',
        icon: User,
        description: 'Your skills and experience'
      },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="w-64 bg-white h-full flex flex-col shadow-xl">
      {/* Logo/Brand */}
      <div className="p-6 bg-brand-soft">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-brand bg-brand-gradient">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand">CodeMind</h1>
            <p className="text-sm text-black font-medium">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-brand-soft shadow-sm'
                  : 'hover:bg-brand-soft'
              }`}
            >
              <Icon 
                className={`w-6 h-6 transition-colors duration-200 ${
                  active ? 'text-brand' : 'text-gray-400 group-hover:text-brand'
                }`} 
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold transition-colors duration-200 ${
                  active ? 'text-brand' : 'text-gray-600 group-hover:text-brand'
                }`}>
                  {item.name}
                </p>
                <p className={`text-xs transition-colors duration-200 ${
                  active ? 'text-black' : 'text-gray-500 group-hover:text-brand/70'
                }`}>
                  {item.description}
                </p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 bg-brand-soft text-brand">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full hover:text-white hover:border-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 font-semibold"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
