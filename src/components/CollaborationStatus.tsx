import React, { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { supabase } from '../supabase'

const CollaborationStatus = ({ documentId }) => {
  const [activeUsers, setActiveUsers] = useState(1)

  useEffect(() => {
    if (documentId) {
      const fetchActiveUsers = async () => {
        const { data, error } = await supabase
          .from('documents')
          .select('active_users')
          .eq('id', documentId)
          .single()

        if (error) {
          console.error('Error fetching active users:', error)
        } else {
          setActiveUsers(data.active_users)
        }
      }

      fetchActiveUsers()

      const subscription = supabase
        .channel(`document_${documentId}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'documents', filter: `id=eq.${documentId}` }, (payload) => {
          setActiveUsers(payload.new.active_users)
        })
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [documentId])

  return (
    <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full">
      <Users className="mr-2" size={18} />
      <span>{activeUsers} active collaborator{activeUsers !== 1 ? 's' : ''}</span>
    </div>
  )
}

export default CollaborationStatus