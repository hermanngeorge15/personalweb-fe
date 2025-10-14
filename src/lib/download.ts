// Download utilities

/**
 * Download CV as PDF from backend
 * @param slug - User slug (e.g., 'jirihermann')
 * @param lang - Language code (e.g., 'eng')
 */
export async function downloadCV(
  slug: string = 'jirihermann',
  lang: string = 'eng',
): Promise<void> {
  try {
    const url = `/api/cv/${slug}.${lang}.pdf`

    // Fetch the PDF
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to download CV: ${response.statusText}`)
    }

    // Get the blob
    const blob = await response.blob()

    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${slug}-cv-${lang}.pdf`

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Failed to download CV:', error)
    throw error
  }
}
