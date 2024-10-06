import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { createAuthCode } from '@/utils/create-auth-code'
import { Elysia, t } from 'elysia'

export const sendAuthCode = new Elysia().post(
	'/auth/code',
	async ({ body: { email }, set }) => {
		set.status = 201

		const authCodePreviouslySent = await prisma.authCode.findUnique({
			where: { email },
		})

		if (authCodePreviouslySent) {
			await prisma.authCode.delete({
				where: { email },
			})
		}

		const code = createAuthCode()

		await prisma.authCode.create({
			data: { content: code, email },
		})

		await resend.emails.send({
			from: 'reminder@resend.dev',
			to: email,
			subject: 'Reminder | Your auth code',
			html: `Your code is ${code}.`,
		})
	},
	{
		body: t.Object(
			{ email: t.String({ format: 'email' }) },
			{ description: 'Expected an email' },
		),
		detail: {
			summary: 'Sends auth code to user',
			tags: ['auth'],
		},
		response: {
			201: t.Void(),
		}
	},
)
