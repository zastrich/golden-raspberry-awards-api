import { MovieStudio, Studio } from '../entities/index.js'
import { DataSource } from 'typeorm'

export async function insertStudio(
  dataSource: DataSource,
  studioName: string,
  movieId: number,
) {
  let studio = await dataSource.manager.findOne(Studio, {
    where: { name: studioName },
  })

  if (!studio) {
    studio = await dataSource.manager.save(
      dataSource.manager.create(Studio, { name: studioName }),
    )
  }

  let movieStudio = await dataSource.manager.findOne(MovieStudio, {
    where: {
      movieId: movieId,
      studioId: studio.id,
    },
  })

  if (!movieStudio) {
    movieStudio = await dataSource.manager.save(
      dataSource.manager.create(MovieStudio, {
        movieId: movieId,
        studioId: studio.id,
      }),
    )
  }
  return studio
}
