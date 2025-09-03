import { MovieProducer, Producer } from '../entities/index.js'
import { DataSource } from 'typeorm'

export async function insertProducer(
  dataSource: DataSource,
  producerName: string,
  movieId: number,
) {
  let producer = await dataSource.manager.findOne(Producer, {
    where: { name: producerName },
  })
  if (!producer) {
    producer = await dataSource.manager.save(
      dataSource.manager.create(Producer, { name: producerName }),
    )
  }

  let movieProducer = await dataSource.manager.findOne(MovieProducer, {
    where: {
      movieId: movieId,
      producerId: producer.id,
    },
  })

  if (!movieProducer) {
    movieProducer = await dataSource.manager.save(
      dataSource.manager.create(MovieProducer, {
        movieId: movieId,
        producerId: producer.id,
      }),
    )
  }
  return producer
}
