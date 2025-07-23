import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftCircle } from 'lucide-react'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-indigo-100 px-4">
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-3xl shadow-2xl p-10 text-center">
        <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Oops! Looks like the page you're trying to reach doesn't exist.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"
          >
            <ArrowLeftCircle size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
