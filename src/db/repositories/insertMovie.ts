import { Movie } from '../entities/index.js'
import { DataSource } from 'typeorm'
import { MovieCsvRow } from '../../loaders/types.js'

export async function insertMovie(
  dataSource: DataSource,
  movieData: MovieCsvRow,
  isWinner: boolean,
) {
  let movie = await dataSource.manager.findOne(Movie, {
    where: {
      year: Number(movieData.year),
      title: String(movieData.title ?? '').trim(),
    },
  })

  if (!movie) {
    movie = await dataSource.manager.save(
      dataSource.manager.create(Movie, {
        year: Number(movieData.year),
        title: String(movieData.title ?? '').trim(),
        winner: isWinner,
      }),
    )
  }
  return movie
}
