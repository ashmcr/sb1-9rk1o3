import React, { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { supabase } from '../supabase'

const VersionHistory = ({ documentId }) => {
  const [versions, setVersions] = useState([])

  useEffect(() => {
    if (documentId) {
      fetchVersionHistory()
    }
  }, [documentId])

  const fetchVersionHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setVersions(data)
    } catch (error) {
      console.error('Error fetching version history:', error)
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Version History</h3>
      <ul className="space-y-2">
        {versions.map((version) => (
          <li
            key={version.id}
            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            <span className="flex items-center">
              <Clock className="mr-2" size={18} />
              {new Date(version.created_at).toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">{version.author}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default VersionHistory