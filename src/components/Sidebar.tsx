import React from 'react'
import { FileText, PlusCircle, Settings, BarChart2, History, Users, BookOpen } from 'lucide-react'

const Sidebar = ({ onNavigate }) => {
  return (
    <aside className="bg-gray-800 text-white w-64 flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">ConsentFlow</h1>
      </div>
      <nav className="flex-1">
        <ul>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <FileText className="inline-block mr-2" /> Dashboard
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => onNavigate('editor')}>
            <PlusCircle className="inline-block mr-2" /> New Document
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => onNavigate('templates')}>
            <BookOpen className="inline-block mr-2" /> Templates
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => onNavigate('history')}>
            <History className="inline-block mr-2" /> Version History
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => onNavigate('collaborators')}>
            <Users className="inline-block mr-2" /> Collaborators
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => onNavigate('analytics')}>
            <BarChart2 className="inline-block mr-2" /> Analytics
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => onNavigate('settings')}>
            <Settings className="inline-block mr-2" /> Settings
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar