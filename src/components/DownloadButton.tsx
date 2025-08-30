'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, CheckCircle, AlertCircle, Loader2, Monitor, HardDrive } from 'lucide-react'
import { downloadService, type VersionInfo, type SystemInfo } from '@/lib/download-service'

interface DownloadButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  platform?: 'macos' | 'auto'
  version?: string
  className?: string
  showSystemInfo?: boolean
  showVersion?: boolean
  children?: React.ReactNode
}

type DownloadState = 'idle' | 'loading' | 'downloading' | 'success' | 'error'

export default function DownloadButton({
  variant = 'primary',
  size = 'md',
  platform = 'auto',
  version = 'latest',
  className = '',
  showSystemInfo = false,
  showVersion = false,
  children
}: DownloadButtonProps) {
  const [state, setState] = useState<DownloadState>('idle')
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recommendedPlatform, setRecommendedPlatform] = useState<'macos'>('macos')

  // Load system info and version info on mount
  useEffect(() => {
    const loadInfo = async () => {
      setState('loading')
      try {
        const system = downloadService.detectSystem()
        setSystemInfo(system)

        // Set recommended platform (always macOS)
        setRecommendedPlatform('macos')

        const versionData = await downloadService.getLatestVersion()
        setVersionInfo(versionData)
        setState('idle')
      } catch (err) {
        console.error('Failed to load download info:', err)
        setError(err instanceof Error ? err.message : 'Failed to load download info')
        setState('error')
      }
    }

    loadInfo()
  }, [platform])

  const handleDownload = async () => {
    if (state === 'downloading') return

    setState('downloading')
    setError(null)

    try {
      await downloadService.startDownload(recommendedPlatform, version)
      setState('success')
      
      // Reset to idle after success animation
      setTimeout(() => setState('idle'), 2000)
    } catch (err) {
      console.error('Download failed:', err)
      setError(err instanceof Error ? err.message : 'Download failed')
      setState('error')
      
      // Reset to idle after error display
      setTimeout(() => setState('idle'), 3000)
    }
  }

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary'
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
      case 'outline':
        return 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white'
      default:
        return 'btn-primary'
    }
  }

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm'
      case 'md':
        return 'px-6 py-3 text-base'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  // Get icon for current state
  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin" />
      case 'downloading':
        return <Loader2 className="w-5 h-5 animate-spin" />
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Download className="w-5 h-5" />
    }
  }

  // Get button text
  const getButtonText = () => {
    if (children) return children

    switch (state) {
      case 'loading':
        return 'Loading...'
      case 'downloading':
        return 'Starting Download...'
      case 'success':
        return 'Download Started!'
      case 'error':
        return 'Try Again'
      default:
        return 'Download for macOS'
    }
  }

  // Get file info
  const getFileInfo = () => {
    if (!versionInfo || !showVersion) return null

    const build = versionInfo.builds.macos

    if (!build) return null

    return (
      <div className="text-xs text-gray-500 mt-1">
        {versionInfo.version} • {build.size} • {build.filename}
      </div>
    )
  }

  const isDisabled = state === 'loading' || state === 'downloading'

  return (
    <div className={`inline-block ${className}`}>
      <motion.button
        onClick={handleDownload}
        disabled={isDisabled}
        className={`
          relative overflow-hidden rounded-lg font-semibold
          transition-all duration-200
          flex items-center gap-2 justify-center
          disabled:opacity-50 disabled:cursor-not-allowed
          ${getVariantStyles()}
          ${getSizeStyles()}
        `}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={state}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {getIcon()}
            {getButtonText()}
          </motion.span>
        </AnimatePresence>

        {/* Success animation overlay */}
        <AnimatePresence>
          {state === 'success' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-green-400 rounded-lg"
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Version and file info */}
      {getFileInfo()}

      {/* System info display */}
      {showSystemInfo && systemInfo && (
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Monitor className="w-3 h-3" />
            macOS {systemInfo.arch}
          </span>
          {versionInfo && (
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {versionInfo.builds.macos?.size}
            </span>
          )}
        </div>
      )}

      {/* Error display */}
      <AnimatePresence>
        {error && state === 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}