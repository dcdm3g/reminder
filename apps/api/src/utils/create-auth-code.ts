export function createAuthCode() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	let code = ''

	while (code.length < 6) {
		code += chars[Math.round(Math.random() * (chars.length - 1))]
	}

	return code
}
