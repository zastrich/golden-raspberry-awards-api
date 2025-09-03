import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import type { IMovieStudio } from './types.js'

@Index(['name'])
@Entity('studios')
export class Studio {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, type: 'varchar' })
  name!: string

  @OneToMany('MovieStudio', 'studio')
  movieStudios!: IMovieStudio[]
}
