import React, { useState, useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Save, AlertCircle, Plus } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import SignatureCanvas from 'react-signature-canvas'
import { supabase } from '../supabase'
import Toast from './Toast'

const Editor = ({ documentId }) => {
  const [content, setContent] = useState('')
  const [formFields, setFormFields] = useState([])
  const [showSignature, setShowSignature] = useState(false)
  const signatureRef = useRef()
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    if (documentId) {
      fetchDocument()
      const subscription = supabase
        .channel(`document_${documentId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'documents', filter: `id=eq.${documentId}` }, handleRealTimeUpdates)
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [documentId])

  const fetchDocument = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (error) throw error

      setContent(data.content)
      setFormFields(data.form_fields || [])
    } catch (error) {
      console.error("Error fetching document:", error)
      showToast('Error fetching document', 'error')
    }
  }

  const handleRealTimeUpdates = (payload) => {
    const { new: newDocument } = payload
    setContent(newDocument.content)
    setFormFields(newDocument.form_fields || [])
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          content,
          form_fields: formFields,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)

      if (error) throw error

      const { error: versionError } = await supabase
        .from('document_versions')
        .insert({
          document_id: documentId,
          content,
          created_at: new Date().toISOString(),
          author: (await supabase.auth.getUser()).data.user.email
        })

      if (versionError) throw versionError

      showToast('Document saved successfully', 'success')
    } catch (error) {
      console.error('Error saving document:', error)
      showToast('Error saving document', 'error')
    }
  }

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  // ... (rest of the component code remains the same)

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {/* ... (existing JSX) */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={handleSave}
      >
        <Save className="inline-block mr-2" />
        Save
      </button>
      {/* ... (rest of the JSX) */}
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

export default Editor