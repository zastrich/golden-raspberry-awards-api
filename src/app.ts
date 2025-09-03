import Fastify from 'fastify'
import chalk from 'chalk'
import { loadCsvIntoDb } from './loaders/index.js'
import { registerRoutes } from './routes/index.js'
import { initializeDataSource } from './db/dataSource.js'

export async function buildApp() {
  try {
    const startTime = Date.now()

    await initializeDataSource()

    await loadCsvIntoDb()

    const app = Fastify({ logger: false })
    registerRoutes(app)

    console.log(
      chalk.greenBright('Application built successfully'),
      chalk.cyan(`(${(Date.now() - startTime) / 1000} seconds)\n`),
      chalk.greenBright('Server will listen on:'),
      chalk.cyanBright(
        `http://localhost:${process.env.PORT}/api/movies/maxMinWinIntervalForProducers`,
      ),
    )

    return app
  } catch (error) {
    console.log(
      chalk.bgRedBright('ERROR'),
      chalk.redBright(
        `Failed to build application: ${error instanceof Error ? error.message : String(error)}`,
      ),
    )
    throw error
  }
}
