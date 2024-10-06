import { prisma } from '@/lib/prisma'
import { jwt } from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

export const deleteReminder = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			// biome-ignore lint/style/noNonNullAssertion: I'll improve this later
			secret: process.env.JWT_SECRET!,
			schema: t.Object({ userId: t.String({ format: 'uuid' }) }),
		}),
	)
	.delete(
		'/reminders/:id',
		async ({ params: { id }, cookie: { token }, set, jwt, error }) => {
			set.status = 204
			const payload = await jwt.verify(token.value)

			if (!payload) {
				return error(401, 'Unauthorized')
			}

			await prisma.reminder.delete({
				where: { id },
			})
		},
		{
			cookie: t.Cookie({
				token: t.String(),
			}),
			params: t.Object({
				id: t.String({ format: 'uuid' }),
			}),
			response: {
				401: t.Literal('Unauthorized'),
				204: t.Void(),
			},
			detail: {
        summary: 'Deletes a reminder',
        tags: ['reminders'],
      }
		},
	)
