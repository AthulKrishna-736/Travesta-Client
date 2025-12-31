import React from 'react'
import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ISubscriptionLockProps {
    title: string
}
const SubscriptionLock: React.FC<ISubscriptionLockProps> = ({ title }) => {
    const navigate = useNavigate()
    return (
        <div className="text-center text-gray-500 flex flex-col items-center justify-center py-10">
            <Lock className="mb-2 w-8 h-8 text-gray-400" />
            <p className="text-lg mb-4">{title}</p>
            <button
                onClick={() => navigate('/user/subscription')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Go to Subscription
            </button>
        </div>
    )
}

export default SubscriptionLock