import { FastifyInstance } from 'fastify'
import { maxMinWinIntervalForProducers } from './movies/index.js'

export const registerRoutes = (app: FastifyInstance) => {
  app.get(
    '/api/movies/maxMinWinIntervalForProducers',
    maxMinWinIntervalForProducers,
  )

  app.get('/api/health', async () => ({ ok: true }))
}
