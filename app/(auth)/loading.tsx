'use client'

import { useState, useEffect } from 'react'
import WhiteLogo from '@/components/etc/whitelogo'

export default function Loading() {
  const [dots, setDots] = useState(0)

  useEffect(() => { 
    const iv = setInterval(() => {
      setDots(prev => (prev + 1) % 4)
    }, 500)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome!</h1>
      <p className="text-gray-600 mb-6">
        Loading your Noonchi Coach{'.'.repeat(dots)}
      </p>
      <WhiteLogo />
    </div>
  )
}
