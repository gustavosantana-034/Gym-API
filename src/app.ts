import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { userRoutes } from './http/controllers/routes'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()

app.register(userRoutes)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issue: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
