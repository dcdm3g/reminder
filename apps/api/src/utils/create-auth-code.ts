export function createAuthCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  let counter = 6

  while (counter > 0) {
    code += chars[Math.round(Math.random() * (chars.length - 1))]
    counter--
  }

  return code
}