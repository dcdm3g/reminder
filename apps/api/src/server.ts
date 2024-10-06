import { login } from '@/routes/login'
import { logout } from '@/routes/logout'
import { sendAuthCode } from '@/routes/send-auth-code'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'

const app = new Elysia()
	.use(swagger({ path: '/docs' }))
	.use(sendAuthCode)
	.use(login)
	.use(logout)
	.listen(3000)

console.log(`Server running at ${app.server?.url}`)
