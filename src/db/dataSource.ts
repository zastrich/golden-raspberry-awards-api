import 'reflect-metadata'
import { DataSource } from 'typeorm'
import chalk from 'chalk'
import {
  Movie,
  MovieProducer,
  MovieStudio,
  Producer,
  Studio,
} from './entities/index.js'

let dataSource: DataSource | null = null

export async function initializeDataSource() {
  if (!dataSource) {
    try {
      const startTime = Date.now()
      console.log(chalk.blue('Establishing database connection\n'))

      dataSource = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: false,
        entities: [Movie, Producer, Studio, MovieProducer, MovieStudio],
        migrations: [],
        subscribers: [],
      })
      await dataSource.initialize()

      console.log(
        chalk.greenBright('Database connected'),
        chalk.cyan(`(${(Date.now() - startTime) / 1000} seconds)\n`),
      )
    } catch (error) {
      console.log(
        chalk.bgRedBright('ERROR'),
        chalk.redBright(
          `Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`,
        ),
      )
      throw error
    }
  }
  return dataSource
}

export async function getDataSource() {
  if (!dataSource) {
    await initializeDataSource()
  }
  return dataSource!
}

export async function closeDataSource() {
  if (dataSource) {
    await dataSource.destroy()
    dataSource = null
  }
}
