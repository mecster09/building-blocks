'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close if clicking the backdrop or the bottom padding area
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-40">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet/Modal container - Added onClick handler here */}
      <div 
        className="fixed inset-x-0 bottom-0 pb-20 sm:static sm:flex sm:items-center sm:justify-center sm:min-h-screen sm:p-4"
        onClick={handleBackdropClick}
      >
        {/* Sheet/Modal panel */}
        <div 
          ref={modalRef}
          className="w-full bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl 
                     transform transition-all duration-300 ease-out
                     sm:max-w-md sm:w-full sm:mx-auto
                     translate-y-0 sm:translate-y-0"
          style={{
            maxHeight: 'calc(85vh - 5rem)',
            overflowY: 'auto',
          }}
        >
          {/* Drag handle for mobile */}
          <div className="sm:hidden w-full h-1 flex items-center justify-center p-4">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"/>
          </div>

          <div className="p-6 pt-2">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
} 