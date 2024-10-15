import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { createReminder } from './routes/create-reminder'
import { deleteReminder } from './routes/delete-reminder'
import { editReminder } from './routes/edit-reminder'
import { getReminder } from './routes/get-reminder'
import { getReminders } from './routes/get-reminders'
import { login } from './routes/login'
import { logout } from './routes/logout'
import { sendAuthCode } from './routes/send-auth-code'

export const app = new Elysia()
	.use(swagger({ path: '/docs' }))
	.use(sendAuthCode)
	.use(login)
	.use(logout)
	.use(getReminders)
	.use(getReminder)
	.use(createReminder)
	.use(editReminder)
	.use(deleteReminder)
	.listen(3000)

console.log(`Server running at ${app.server?.url}`)
