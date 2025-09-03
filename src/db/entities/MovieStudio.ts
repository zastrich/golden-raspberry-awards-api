import { Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm'
import type { IMovie, IStudio } from './types.js'

@Index(['movieId'])
@Index(['studioId'])
@Entity('movie_studios')
export class MovieStudio {
  @PrimaryColumn({ type: 'integer' })
  movieId!: number

  @PrimaryColumn({ type: 'integer' })
  studioId!: number

  @ManyToOne('Movie', 'movieStudios', {
    onDelete: 'CASCADE',
    lazy: true,
  })
  movie!: IMovie

  @ManyToOne('Studio', 'movieStudios', {
    onDelete: 'CASCADE',
    lazy: true,
  })
  studio!: IStudio
}
