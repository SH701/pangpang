"use client"

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid'

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
  isOpen: boolean
  onToggle: () => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  isOpen,
  onToggle,
  placeholder = 'Search...',
  className = '',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  // 열릴 때 자동 포커스
  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
  }, [isOpen])

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="search-wrap"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 120, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
              className="w-full border rounded pl-3 pr-7 py-2 text-sm"
              placeholder={placeholder}
              aria-label="search"
            />
            {/* 입력값 지우기 */}
            {value && (
              <button
                type="button"
                aria-label="clear"
                onClick={() => onChange('')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
              >
                <XMarkIcon className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 토글 버튼 (돋보기) */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? 'close search' : 'open search'}
        className="cursor-pointer p-1.5 rounded hover:bg-gray-100"
      >
        <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  )
}