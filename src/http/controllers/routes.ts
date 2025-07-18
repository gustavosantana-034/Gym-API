import { FastifyInstance } from 'fastify'
import { register } from './user/register.controller'
import { authenticate } from './user/authenticate.controller'
import { profile } from './user/profile'
import { verfifyJWT } from './middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /** Authenticated */
  app.get('/me', { onRequest: [verfifyJWT] }, profile)
}
