import { useEffect, useState } from 'react'

interface BuildInfo {
  buildTime: string
  buildNumber: string
  commit: string
  branch: string
  timestamp: number
}

/**
 * Component to display build version info (visible in dev tools console)
 * Also checks for new builds and notifies user
 */
export function BuildVersion() {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null)
  const [hasUpdate, setHasUpdate] = useState(false)

  useEffect(() => {
    // Fetch build info
    const fetchBuildInfo = async () => {
      try {
        const response = await fetch('/build-info.json?t=' + Date.now())
        
        if (!response.ok) {
          console.warn('Build info not available (this is normal in local dev)')
          return
        }
        
        const info = await response.json()
        setBuildInfo(info)

        // Check if there's a cached version
        const cachedTimestamp = localStorage.getItem('buildTimestamp')
        if (cachedTimestamp && cachedTimestamp !== info.timestamp.toString()) {
          setHasUpdate(true)
        }
        localStorage.setItem('buildTimestamp', info.timestamp.toString())

        // Log to console
        console.log('🏗️ Build Info:', info)
      } catch (error) {
        // Silently fail in dev, build-info.json only exists in production
        console.debug('Build info not available:', error)
      }
    }

    fetchBuildInfo()

    // Check for updates every 5 minutes
    const interval = setInterval(fetchBuildInfo, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (hasUpdate) {
    console.warn(
      '🔄 New version available! Please refresh the page.',
      buildInfo,
    )
  }

  // This component doesn't render anything visible
  // Build info is logged to console
  return null
}
