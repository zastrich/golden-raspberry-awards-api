import { Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm'
import type { IMovie, IProducer } from './types.js'

@Index(['movieId'])
@Index(['producerId'])
@Entity('movie_producers')
export class MovieProducer {
  @PrimaryColumn({ type: 'integer' })
  movieId!: number

  @PrimaryColumn({ type: 'integer' })
  producerId!: number

  @ManyToOne('Movie', 'movieProducers', {
    onDelete: 'CASCADE',
    lazy: true,
  })
  movie!: IMovie

  @ManyToOne('Producer', 'movieProducers', {
    onDelete: 'CASCADE',
    lazy: true,
  })
  producer!: IProducer
}
