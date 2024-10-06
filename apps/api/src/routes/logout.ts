import jwt from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

export const logout = new Elysia().delete(
	'/auth/logout',
	({ cookie: { token }, set }) => {
		set.status = 204
		token.remove()
	},
	{
		cookie: t.Cookie({
			token: t.String(),
		}),
		response: {
			204: t.Void(),
		},
		detail: {
			summary: 'Unauthenticates an user',
			tags: ['auth'],
		},
	},
)
