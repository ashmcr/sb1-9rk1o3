import React, { useState, useEffect } from 'react'
import { FileText, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../supabase'
import Toast from './Toast'

const TEMPLATES_PER_PAGE = 10

const TemplateLibrary = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    fetchTemplates()
  }, [page])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const { data, error, count } = await supabase
        .from('templates')
        .select('*', { count: 'exact' })
        .range(page * TEMPLATES_PER_PAGE, (page + 1) * TEMPLATES_PER_PAGE - 1)
        .order('created_at', { ascending: false })

      if (error) throw error

      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
      showToast('Error fetching templates', 'error')
    }
    setLoading(false)
  }

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Template Library</h3>
      <ul className="space-y-2">
        {templates.map((template) => (
          <li
            key={template.id}
            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => onSelectTemplate(template)}
          >
            <span className="flex items-center">
              <FileText className="mr-2" size={18} />
              {template.name}
            </span>
            <Plus size={18} />
          </li>
        ))}
      </ul>
      {loading && <p className="mt-4">Loading...</p>}
      {!loading && (
        <div className="mt-4 flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
            onClick={() => setPage(page + 1)}
            disabled={templates.length < TEMPLATES_PER_PAGE}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  )
}

export default TemplateLibrary