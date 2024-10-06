import { prisma } from '@/lib/prisma'
import { jwt } from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

export const login = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			// biome-ignore lint/style/noNonNullAssertion: I'll improve this later
			secret: process.env.JWT_SECRET!,
			schema: t.Object({ userId: t.String({ format: 'uuid' }) }),
		}),
	)
	.post(
		'/auth/login',
		async ({ body: { email, code }, cookie: { token }, error, jwt, set }) => {
			set.status = 201

			const authCodeSent = await prisma.authCode.findUnique({
				where: { email },
			})

			if (
				!authCodeSent ||
				new Date().getTime() - authCodeSent.createdAt.getTime() >
					1000 * 60 * 5 ||
				authCodeSent.content !== code
			) {
				return error(401)
			}

			await prisma.authCode.delete({
				where: { email },
			})

			const user = await prisma.user.findUnique({
				where: { email },
			})

			let userId = user?.id

			if (!userId) {
				const { id } = await prisma.user.create({
					data: { email },
				})

				userId = id
			}

			token.set({
				value: await jwt.sign({ userId }),
				maxAge: 60 * 60 * 24 * 7, // 7 days
				httpOnly: true,
			})
		},
		{
			body: t.Object(
				{
					email: t.String({ format: 'email' }),
					code: t.RegExp('^[A-Z0-9]{6}$'),
				},
				{ description: 'Expected email and auth code' },
			),
			detail: {
				summary: 'Authenticates an user',
				tags: ['auth'],
			},
		},
	)
