'use client'

import { useEffect, useState } from "react"
import Image from "next/image"

type LoadingModalProps = {
  open: boolean
}

export default function LoadingModal({ open }: LoadingModalProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!open) return
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."))
    }, 500) // 0.5초마다
    return () => clearInterval(interval)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-[320px] shadow-lg flex flex-col items-center text-center">
        <Image
          src="/etc/exitchar.svg"
          alt="loading"
          width={118}
          height={94}
          className="my-5"
        />
        <p className="text-lg font-semibold mb-2">Feedback is being generated</p>
        <p className="text-sm text-gray-600">
          Please wait a moment{dots}
        </p>
      </div>
    </div>
  )
}