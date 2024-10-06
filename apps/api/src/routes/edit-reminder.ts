import { prisma } from '@/lib/prisma'
import jwt from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

export const editReminder = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			// biome-ignore lint/style/noNonNullAssertion: I'll improve this later
			secret: process.env.JWT_SECRET!,
			schema: t.Object({ userId: t.String({ format: 'uuid' }) }),
		}),
	)
	.put(
		'/reminders/:id',
		async ({
			cookie: { token },
			params: { id },
			body: { summary, remindsAt, description },
			set,
			jwt,
			error,
		}) => {
			set.status = 204
			const payload = await jwt.verify(token.value)

			if (!payload) {
				return error(401, 'Unauthorized')
			}

			await prisma.reminder.update({
				where: { id },
				data: { summary, description, remindsAt },
			})
		},
		{
			cookie: t.Cookie({
				token: t.String(),
			}),
			params: t.Object({
				id: t.String({ format: 'uuid' }),
			}),
			body: t.Partial(
				t.Object({
					summary: t.String({ minLength: 1 }),
					description: t.Optional(t.String({ minLength: 1 })),
					remindsAt: t.Array(t.Date()),
				}),
			),
			response: {
				401: t.Literal('Unauthorized'),
				404: t.Literal('Reminder not found'),
				204: t.Void(),
			},
		},
	)
