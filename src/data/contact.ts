/**
 * Contact details for the "hire me" buttons.
 *
 * The email address is never written out in the page or in this file as plain text,
 * so bots that scrape websites (or GitHub) for addresses don't find it. It is put
 * together only when a visitor clicks "Email me".
 */
const parts = ['zcinio', 'rt', '|', 'moc.liamg'] // reversed pieces

function address(): string {
  const [user2, user1, , domain] = parts.map((p) => p.split('').reverse().join(''))
  return `${user1}${user2}@${domain}`
}

const SUBJECT = 'Hi Natalia, let’s talk about a role'
const BODY = 'Hi Natalia,\n\nI found your Advent CV Calendar and would love to talk about a role.\n\n'

/** A mailto: link with a friendly pre-filled subject and opening line. */
export function emailHref(): string {
  return `mailto:${address()}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`
}

/** Copies the email address to the clipboard. Resolves to false if the browser refuses. */
export async function copyEmail(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(address())
    return true
  } catch {
    // older browsers / no permission: fall back to a hidden text field
    try {
      const field = document.createElement('textarea')
      field.value = address()
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      const ok = document.execCommand('copy')
      field.remove()
      return ok
    } catch {
      return false
    }
  }
}

/** The address as text, for showing it when copying isn't possible. Only called after a click. */
export function emailText(): string {
  return address()
}

/**
 * Opens the visitor's email app. If nothing takes over the browser within about a second
 * (no email app set up, so the click did nothing), `onNoEmailApp` is called instead.
 */
export function openEmail(onNoEmailApp: () => void) {
  let leftThePage = false
  const onLeave = () => {
    leftThePage = true
  }
  window.addEventListener('blur', onLeave)
  document.addEventListener('visibilitychange', onLeave)
  window.location.href = emailHref()
  window.setTimeout(() => {
    window.removeEventListener('blur', onLeave)
    document.removeEventListener('visibilitychange', onLeave)
    if (!leftThePage) onNoEmailApp()
  }, 1200)
}
