import jwt from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

export const logout = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			// biome-ignore lint/style/noNonNullAssertion: I'll improve this later
			secret: process.env.JWT_SECRET!,
			schema: t.Object({ userId: t.String({ format: 'uuid' }) }),
		}),
	)
	.delete('/auth/logout', ({ cookie: { token }, set }) => {
		set.status = 204
		token.remove()
	}, {
		cookie: t.Cookie({
			token: t.String(),
		}),
		detail: {
			summary: 'Unauthenticates an user',
			tags: ['auth'],
		},
	})
