/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_PROXY_TARGET?: string
  readonly VITE_RECAPTCHA_SITE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// reCAPTCHA v3 type declarations
interface ReCaptchaV3 {
  ready: (callback: () => void) => void
  execute: (
    siteKey: string,
    options: { action: string },
  ) => Promise<string>
}

interface Window {
  grecaptcha?: ReCaptchaV3
}
