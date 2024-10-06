import { Elysia } from 'elysia'

const app = new Elysia().get('/', () => 'Hello Ellysia').listen(3000)
console.log(`Server running at ${app.server?.url}`)
