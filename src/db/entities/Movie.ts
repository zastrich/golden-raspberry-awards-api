import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import type { IMovieProducer, IMovieStudio } from './types.js'

@Index(['winner', 'year'])
@Index(['year', 'title'])
@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'integer' })
  year!: number

  @Column({ type: 'varchar' })
  title!: string

  @Column({ default: false, type: 'boolean' })
  winner!: boolean

  @OneToMany('MovieProducer', 'movie')
  movieProducers!: IMovieProducer[]

  @OneToMany('MovieStudio', 'movie')
  movieStudios!: IMovieStudio[]
}
