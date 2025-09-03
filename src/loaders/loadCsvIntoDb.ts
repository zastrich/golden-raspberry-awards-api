import chalk from 'chalk'

import { Movie, Producer, Studio } from '../db/entities/index.js'

import { getDataSource } from '../db/dataSource.js'
import { readCsvFile } from './readCsvFile.js'
import { insertMovie } from '../db/repositories/insertMovie.js'
import { insertProducer } from '../db/repositories/insertProducer.js'
import { insertStudio } from '../db/repositories/insertStudio.js'
import { splitNames } from '../helpers/string.helpers.js'

export async function loadCsvIntoDb() {
  const dataSource = await getDataSource()
  const path = process.env.CSV_PATH ?? './data/movies.csv'
  try {
    const startTime = Date.now()
    console.log(
      chalk.magentaBright('Populating database tables by CSV file'),
      chalk.cyan('Initiate...'),
    )

    const rows = readCsvFile(path)

    console.log(
      chalk.whiteBright('found'),
      chalk.greenBright(rows.length),
      chalk.whiteBright('rows'),
    )

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

    await dataSource.transaction(async (manager) => {
      counters.movies.start = await manager.count(Movie)
      counters.studios.start = await manager.count(Studio)
      counters.producers.start = await manager.count(Producer)

      for (const movieData of rows) {
        const isWinner =
          String(movieData.winner ?? '').toLowerCase() === 'yes' ||
          String(movieData.winner ?? '').toLowerCase() === 'true' ||
          String(movieData.winner ?? '').toLowerCase() === '1'

        const movie = await insertMovie(dataSource, movieData, isWinner)

        const producers = splitNames(String(movieData.producers ?? '').trim())
        for (const producerName of producers) {
          await insertProducer(dataSource, producerName, movie.id)
        }

        const studios = splitNames(String(movieData.studios ?? '').trim())
        for (const studioName of studios) {
          await insertStudio(dataSource, studioName, movie.id)
        }
      }

      counters.movies.final = await manager.count(Movie)
      counters.studios.final = await manager.count(Studio)
      counters.producers.final = await manager.count(Producer)
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
