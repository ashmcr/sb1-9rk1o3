import React from 'react'
import { Bell, User } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Bell size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header