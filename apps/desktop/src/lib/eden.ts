import { edenTreaty } from '@elysiajs/eden'
import type { app } from '@reminder/api'

// biome-ignore lint/style/noNonNullAssertion: I'll improve this later
export const eden = edenTreaty<typeof app>(process.env.VITE_API_BASE_URL!)
