import { getDataSource } from '../db/dataSource.js'

export interface Interval {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

export async function getProducerWinIntervals(): Promise<{
  min: Interval[]
  max: Interval[]
}> {
  const dataSource = await getDataSource()
  const intervalsQuery = `
    WITH ConsecutiveWins AS (
      SELECT 
        p.name as producer,
        m.year as year,
        LEAD(m.year) OVER (PARTITION BY p.name ORDER BY m.year) as next_win_year
      FROM producers p
      INNER JOIN movie_producers mp ON p.id = mp.producerId
      INNER JOIN movies m ON mp.movieId = m.id
      WHERE m.winner = true
    ),
    Intervals AS (
      SELECT 
        producer,
        year as previousWin,
        next_win_year as followingWin,
        (next_win_year - year) as interval
      FROM ConsecutiveWins
      WHERE next_win_year IS NOT NULL
    )`

  const minProducers = await dataSource.query(`
    ${intervalsQuery}
    SELECT producer, interval, previousWin, followingWin
    FROM Intervals
    WHERE interval = (SELECT MIN(interval) FROM Intervals)
    ORDER BY producer, previousWin
  `)

  const maxProducers = await dataSource.query(`
    ${intervalsQuery}
    SELECT producer, interval, previousWin, followingWin
    FROM Intervals
    WHERE interval = (SELECT MAX(interval) FROM Intervals)
    ORDER BY producer, previousWin
  `)

  return {
    min: minProducers,
    max: maxProducers,
  }
}
