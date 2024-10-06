import { prisma } from '@/lib/prisma'
import { jwt } from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

export const getReminders = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			// biome-ignore lint/style/noNonNullAssertion: I'll improve this later
			secret: process.env.JWT_SECRET!,
			schema: t.Object({ userId: t.String({ format: 'uuid' }) }),
		}),
	)
	.get(
		'/reminders',
		async ({ cookie: { token }, jwt, error }) => {
			const payload = await jwt.verify(token.value)

			if (!payload) {
				return error(401, 'Unauthorized')
			}

			const reminders = await prisma.reminder.findMany({
				where: { userId: payload.userId },
			})

			return {
				reminders: reminders.map(({ remindsAt, ...rest }) => {
					const lastRemindAt = remindsAt[remindsAt.length - 1]
					const nextRemindAt = lastRemindAt > new Date() ? lastRemindAt : null

					return {
						...rest,
						nextRemindAt,
					}
				}),
			}
		},
		{
			cookie: t.Cookie({
				token: t.String(),
			}),
			response: {
				401: t.Literal('Unauthorized'),
				200: t.Object({
					reminders: t.Array(
						t.Object({
							id: t.String({ format: 'uuid' }),
							summary: t.String({ minLength: 1 }),
							description: t.Nullable(t.String({ minLength: 1 })),
							nextRemindAt: t.Nullable(
								t.Date({ minimumTimestamp: new Date().getTime() }),
							),
						}),
					),
				}),
			},
			detail: {
				summary: 'Gets all reminders',
				tags: ['reminders'],
			},
		},
	)
