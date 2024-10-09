import React, { useState, useEffect } from 'react'
import { FileText, PlusCircle, Settings, BarChart2, History, Users, BookOpen } from 'lucide-react'
import Editor from './components/Editor'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import TemplateLibrary from './components/TemplateLibrary'
import VersionHistory from './components/VersionHistory'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import CollaborationStatus from './components/CollaborationStatus'
import Auth from './components/Auth'
import Toast from './components/Toast'
import { supabase } from './supabase'
import { Session } from '@supabase/supabase-js'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentDocument, setCurrentDocument] = useState(null)
  const [session, setSession] = useState<Session | null>(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session && currentDocument) {
      // Update active users when a document is opened
      const updateActiveUsers = async () => {
        const { error } = await supabase
          .from('documents')
          .update({ active_users: 1 }) // Increment this value when a user joins
          .eq('id', currentDocument.id)

        if (error) {
          console.error('Error updating active users:', error)
          showToast('Error updating active users', 'error')
        }
      }

      updateActiveUsers()

      return () => {
        // Decrement active users when component unmounts
        supabase
          .from('documents')
          .update({ active_users: 0 }) // Decrement when the user leaves
          .eq('id', currentDocument.id)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating active users:', error)
            }
          })
      }
    }
  }, [session, currentDocument])

  const createNewDocument = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          content: '',
          user_id: session?.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          active_users: 1
        })
        .select()

      if (error) throw error

      setCurrentDocument(data[0])
      setCurrentView('editor')
      showToast('New document created successfully', 'success')
    } catch (error) {
      console.error('Error creating new document:', error)
      showToast('Error creating new document', 'error')
    }
  }

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const renderContent = () => {
    if (!session) {
      return <Auth />
    }

    switch (currentView) {
      case 'editor':
        return (
          <>
            <CollaborationStatus documentId={currentDocument?.id} />
            <Editor documentId={currentDocument?.id} />
          </>
        )
      case 'templates':
        return <TemplateLibrary onSelectTemplate={(template) => {
          setCurrentDocument(template)
          setCurrentView('editor')
        }} />
      case 'history':
        return <VersionHistory documentId={currentDocument?.id} />
      case 'analytics':
        return <AnalyticsDashboard />
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to ConsentFlow</h2>
            <p className="mb-4">Create, manage, and track consent forms effortlessly.</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={createNewDocument}
            >
              <PlusCircle className="inline-block mr-2" />
              Create New Document
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {session && <Sidebar onNavigate={setCurrentView} />}
      <div className="flex-1 flex flex-col">
        {session && <Header />}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
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

export default App