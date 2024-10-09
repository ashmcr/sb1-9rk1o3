import React from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

type ToastProps = {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center`}>
      {type === 'success' ? <CheckCircle className="mr-2" /> : <AlertCircle className="mr-2" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">×</button>
    </div>
  )
}

export default Toast