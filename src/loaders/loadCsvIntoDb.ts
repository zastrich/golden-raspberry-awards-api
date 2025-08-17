import fs from 'node:fs'
import chalk from 'chalk'
import { parse } from 'csv-parse/sync'
import { PrismaClient } from '@prisma/client'

interface MovieCsvRow {
  year: string
  title: string
  studios: string
  producers: string
  winner: string
}

export async function loadCsvIntoDb(prisma: PrismaClient, path: string) {
  try {
    const startTime = Date.now()
    console.log(
      chalk.magentaBright('Populating database tables by CSV file'),
      chalk.cyan('Initiate...'),
    )

    const raw = fs.readFileSync(path, 'utf8')
    const rows = parse(raw, {
      columns: (header) => header.map((column) => column.toLowerCase()),
      skip_empty_lines: true,
      trim: true,
      delimiter: ';',
    }) as MovieCsvRow[]

    const counters = {
      movies: {
        start: 0,
        final: 0,
      },
      studios: {
        start: 0,
        final: 0,
      },
      producers: {
        start: 0,
        final: 0,
      },
    }

    console.log(
      chalk.whiteBright('found'),
      chalk.greenBright(rows.length),
      chalk.whiteBright('rows'),
    )

    const splitNames = (raw: string): string[] =>
      (raw ?? '')
        .split(/,|\band\b/gi)
        .map((s) => s.trim())
        .filter(Boolean)

    await prisma.$transaction(async (tx) => {
      counters.movies.start = await tx.movie.count()
      counters.studios.start = await tx.studio.count()
      counters.producers.start = await tx.producer.count()

      for (const r of rows) {
        const isWinner =
          String(r.winner ?? '').toLowerCase() === 'yes' ||
          String(r.winner ?? '').toLowerCase() === 'true' ||
          String(r.winner ?? '').toLowerCase() === '1'

        const movie = await tx.movie.upsert({
          where: {
            year_title: {
              year: Number(r.year),
              title: String(r.title ?? '').trim(),
            },
          },
          update: {},
          create: {
            year: Number(r.year),
            title: String(r.title ?? '').trim(),
            winner: isWinner,
          },
        })

        const producers = splitNames(String(r.producers ?? '').trim())
        for (const producerName of producers) {
          const producer = await tx.producer.upsert({
            where: { name: producerName },
            update: {},
            create: { name: producerName },
          })

          await tx.movieProducer.upsert({
            where: {
              movie_id_producer_id: {
                movie_id: movie.id,
                producer_id: producer.id,
              },
            },
            update: {},
            create: {
              movie_id: movie.id,
              producer_id: producer.id,
            },
          })
        }

        const studios = splitNames(String(r.studios ?? '').trim())
        for (const studioName of studios) {
          const studio = await tx.studio.upsert({
            where: { name: studioName },
            update: {},
            create: { name: studioName },
          })

          await tx.movieStudio.upsert({
            where: {
              movie_id_studio_id: { movie_id: movie.id, studio_id: studio.id },
            },
            update: {},
            create: {
              movie_id: movie.id,
              studio_id: studio.id,
            },
          })
        }
      }

      counters.movies.final = await tx.movie.count()
      counters.studios.final = await tx.studio.count()
      counters.producers.final = await tx.producer.count()
    })

    console.log(
      chalk.whiteBright('inserted'),
      chalk.greenBright(counters.movies.final - counters.movies.start),
      chalk.whiteBright('movies'),
    )
    console.log(
      chalk.whiteBright('inserted'),
      chalk.greenBright(counters.studios.final - counters.studios.start),
      chalk.whiteBright('studios'),
    )
    console.log(
      chalk.whiteBright('inserted'),
      chalk.greenBright(counters.producers.final - counters.producers.start),
      chalk.whiteBright('producers'),
    )
    console.log(
      chalk.magentaBright('Populating database tables by CSV file'),
      chalk.cyan(`Finished in ${(Date.now() - startTime) / 1000} seconds\n`),
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.log(
      chalk.bgRedBright('ERROR'),
      chalk.redBright(`Error during CSV data loading: ${errorMessage}`),
    )
    throw error
  }
}
