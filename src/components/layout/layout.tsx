import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './sidebar'

const Layout: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear any stored data
    localStorage.removeItem('userSettings')
    localStorage.removeItem('userProfile')
    // Navigate to login
    navigate('/')
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
