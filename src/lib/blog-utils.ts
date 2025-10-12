/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string | undefined): string {
  if (!date) return 'Unknown date'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return 'Unknown date'
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string | undefined): string {
  if (!date) return 'Unknown date'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return 'Unknown date'
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

/**
 * Share on social media
 */
export function shareOnTwitter(title: string, url: string) {
  const text = encodeURIComponent(title)
  const shareUrl = encodeURIComponent(url)
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
    '_blank',
    'width=550,height=420'
  )
}

export function shareOnLinkedIn(url: string) {
  const shareUrl = encodeURIComponent(url)
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    '_blank',
    'width=550,height=420'
  )
}

export function shareOnFacebook(url: string) {
  const shareUrl = encodeURIComponent(url)
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    '_blank',
    'width=550,height=420'
  )
}

