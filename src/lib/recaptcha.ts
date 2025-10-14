// reCAPTCHA v3 Configuration and Utilities

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''
const RECAPTCHA_ENABLED = Boolean(RECAPTCHA_SITE_KEY)

export const RECAPTCHA_ACTIONS = {
  CONTACT_FORM: 'contact_form',
  LOGIN: 'login',
  SIGNUP: 'signup',
} as const

export { RECAPTCHA_ENABLED, RECAPTCHA_SITE_KEY }
