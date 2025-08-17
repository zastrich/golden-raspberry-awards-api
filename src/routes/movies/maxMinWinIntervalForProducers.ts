import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getProducerWinIntervals } from '../../controllers/producersController.js'

const Interval = z.object({
  producer: z.string(),
  interval: z.number(),
  previousWin: z.number(),
  followingWin: z.number(),
})

const ResponseSchema = z.object({
  min: z.array(Interval),
  max: z.array(Interval),
})

export const maxMinWinIntervalForProducers = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const result = await getProducerWinIntervals(request.server.locals.prisma)

  return reply.send(ResponseSchema.parse(result))
}
