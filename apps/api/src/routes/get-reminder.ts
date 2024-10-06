import { prisma } from '@/lib/prisma'
import { jwt } from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

export const getReminder = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			// biome-ignore lint/style/noNonNullAssertion: I'll improve this later
			secret: process.env.JWT_SECRET!,
			schema: t.Object({ userId: t.String({ format: 'uuid' }) }),
		}),
	)
	.get(
		'/reminders/:id',
		async ({ cookie: { token }, params: { id }, jwt, error, set }) => {
			set.status = 201
			const payload = await jwt.verify(token.value)

			if (!payload) {
				return error(401, 'Unauthorized')
			}

			const reminder = await prisma.reminder.findUnique({
				select: { summary: true, description: true, remindsAt: true },
				where: { id },
			})

			if (!reminder) {
				return error(404, 'Reminder not found')
			}

			return { reminder }
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
				404: t.Literal('Reminder not found'),
				200: t.Object({
					reminder: t.Object({
						summary: t.String({ minLength: 1 }),
						description: t.Nullable(t.String({ minLength: 1 })),
						remindsAt: t.Array(t.Date()),
					}),
				}),
			},
			detail: {
				summary: 'Gets a reminder',
				tags: ['reminders'],
			},
		},
	)
