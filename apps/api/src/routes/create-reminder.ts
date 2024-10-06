import { prisma } from '@/lib/prisma'
import jwt from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

export const createReminder = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			// biome-ignore lint/style/noNonNullAssertion: I'll improve this later
			secret: process.env.JWT_SECRET!,
			schema: t.Object({ userId: t.String({ format: 'uuid' }) }),
		}),
	)
	.post(
		'/reminders',
		async ({
			body: { summary, description, remindsAt },
			cookie: { token },
			set,
			jwt,
			error,
		}) => {
			set.status = 201
			const payload = await jwt.verify(token.value)

			if (!payload) {
				return error(401, 'Unauthorized')
			}

			const { id } = await prisma.reminder.create({
				data: { userId: payload.userId, summary, description, remindsAt },
			})

			return { id }
		},
		{
			cookie: t.Cookie({
				token: t.String(),
			}),
			body: t.Object({
				summary: t.String({ minLength: 1 }),
				description: t.Optional(t.String({ minLength: 1 })),
				remindsAt: t.Array(t.Date({ minimumTimestamp: new Date().getTime() })),
			}),
			response: {
				401: t.Literal('Unauthorized'),
				201: t.Object({
					id: t.String({ format: 'uuid' }),
				}),
			},
			detail: {
				summary: 'Creates a reminder',
				tags: ['reminders'],
			},
		},
	)
