import { edenTreaty } from '@elysiajs/eden'
import type { app } from '@reminder/api'

export const eden = edenTreaty<typeof app>('http://192.168.100.26:3000')
