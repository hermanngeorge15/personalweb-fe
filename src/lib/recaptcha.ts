// reCAPTCHA v3 Configuration and Utilities

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''
const RECAPTCHA_ENABLED = Boolean(RECAPTCHA_SITE_KEY)

// Load reCAPTCHA script dynamically
let scriptLoaded = false
let scriptLoading = false

export function loadRecaptchaScript(): Promise<void> {
  if (!RECAPTCHA_ENABLED) {
    return Promise.resolve()
  }

  if (scriptLoaded) {
    return Promise.resolve()
  }

  if (scriptLoading) {
    // Wait for the script to load
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (scriptLoaded) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
    })
  }

  scriptLoading = true

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true

    script.onload = () => {
      scriptLoaded = true
      scriptLoading = false
      resolve()
    }

    script.onerror = () => {
      scriptLoading = false
      reject(new Error('Failed to load reCAPTCHA script'))
    }

    document.head.appendChild(script)
  })
}

// Execute reCAPTCHA and get token
export async function executeRecaptcha(action: string): Promise<string | null> {
  if (!RECAPTCHA_ENABLED) {
    console.warn('reCAPTCHA is not configured')
    return null
  }

  try {
    // Ensure script is loaded
    await loadRecaptchaScript()

    // Wait for grecaptcha to be ready
    return await new Promise<string>((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error('grecaptcha not available'))
        return
      }

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, {
            action,
          })
          resolve(token)
        } catch (error) {
          reject(error)
        }
      })
    })
  } catch (error) {
    console.error('reCAPTCHA execution failed:', error)
    return null
  }
}

export const RECAPTCHA_ACTIONS = {
  CONTACT_FORM: 'contact_form',
  LOGIN: 'login',
  SIGNUP: 'signup',
} as const

export { RECAPTCHA_ENABLED, RECAPTCHA_SITE_KEY }

