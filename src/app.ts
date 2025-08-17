import Fastify from 'fastify'
import chalk from 'chalk'
import { createDb } from './db/index.js'
import { loadCsvIntoDb } from './loaders/index.js'
import { registerRoutes } from './routes/index.js'
import { PrismaClient } from '@prisma/client'

export async function buildApp(csvPath: string) {
  const app = Fastify({ logger: false })

  console.log(chalk.blue('Establishing database connection\n'))
  const prisma = await createDb()
  await loadCsvIntoDb(prisma, csvPath)
  console.log(chalk.greenBright(`Database connected and prepared\n`))

  app.decorate('locals', { prisma })

  registerRoutes(app)

  console.log(
    chalk.greenBright(`Server listening on:`),
    chalk.cyanBright(
      `http://localhost:${process.env.PORT}/api/movies/maxMinWinIntervalForProducers`,
    ),
  )

  return app
}

declare module 'fastify' {
  interface FastifyInstance {
    locals: {
      prisma: PrismaClient
    }
  }
}
