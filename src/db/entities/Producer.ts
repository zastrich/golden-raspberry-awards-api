import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import type { IMovieProducer } from './types.js'

@Index(['name'])
@Entity('producers')
export class Producer {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, type: 'varchar' })
  name!: string

  @OneToMany('MovieProducer', 'producer')
  movieProducers!: IMovieProducer[]
}
