import chalk from 'chalk'
import { PrismaClient } from '@prisma/client'

export async function createDb() {
  const dbInitStrategy = process.env.DB_INIT_STRATEGY?.toUpperCase()
  const databaseUrl = process.env.DATABASE_URL

  const prisma = new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
  })

  try {
    if (dbInitStrategy === 'TRUNCATE') {
      const startTime = Date.now()
      console.log(
        chalk.magentaBright('Truncating database tables'),
        chalk.cyan('Initiate...'),
      )
      await prisma.movieProducer.deleteMany({})
      await prisma.movieStudio.deleteMany({})
      await prisma.movie.deleteMany({})
      await prisma.$executeRawUnsafe(
        'DELETE FROM sqlite_sequence WHERE name = ?',
        'Movie',
      )
      await prisma.producer.deleteMany({})
      await prisma.$executeRawUnsafe(
        'DELETE FROM sqlite_sequence WHERE name = ?',
        'Producer',
      )
      await prisma.studio.deleteMany({})
      await prisma.$executeRawUnsafe(
        'DELETE FROM sqlite_sequence WHERE name = ?',
        'Studio',
      )
      console.log(
        chalk.magentaBright('Truncating database tables'),
        chalk.cyan(`Finished in ${(Date.now() - startTime) / 1000} seconds\n`),
      )
    }

    await prisma.$connect()

    return prisma
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.log(
      chalk.bgRedBright('ERROR'),
      chalk.redBright(`Error during database initialization: ${errorMessage}`),
    )
    throw error
  }
}
