export interface IMovie {
  id: number
  year: number
  title: string
  winner: boolean
  movieProducers: IMovieProducer[]
  movieStudios: IMovieStudio[]
}

export interface IProducer {
  id: number
  name: string
  movieProducers: IMovieProducer[]
}

export interface IStudio {
  id: number
  name: string
  movieStudios: IMovieStudio[]
}

export interface IMovieProducer {
  movieId: number
  producerId: number
  movie: IMovie
  producer: IProducer
}

export interface IMovieStudio {
  movieId: number
  studioId: number
  movie: IMovie
  studio: IStudio
}
