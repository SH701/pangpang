'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/UserContext'

type Feedback = {
  overallEvaluation: string
  politenessScore: number
  naturalnessScore: number
}

export default function FeedbackSection({ id }: { id: number|string }) {
  const { accessToken } = useAuth()
  const [feedback, setFeedback] = useState<Feedback|null>(null)

  useEffect(() => {
    if (!accessToken) return
    fetch(`/api/conversations/${id}/feedback`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => setFeedback(data))
  }, [id, accessToken])

  if (!feedback) return null

  return (
    <div className="px-4 py-3 bg-gray-50 space-y-3">
      <p className="text-sm text-gray-700">{feedback.overallEvaluation}</p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Politeness</span><span>{feedback.politenessScore}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Naturalness</span><span>{feedback.naturalnessScore}</span>
        </div>
      </div>
    </div>
  )
}
