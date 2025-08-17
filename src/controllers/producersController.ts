import { PrismaClient } from '@prisma/client'

export interface Interval {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

export async function getProducerWinIntervals(prisma: PrismaClient): Promise<{
  min: Interval[]
  max: Interval[]
}> {
  // Get all producer wins ordered by year
  const producerWins = await prisma.movieProducer.findMany({
    where: {
      movie: {
        winner: true,
      },
    },
    select: {
      producer: {
        select: {
          name: true,
        },
      },
      movie: {
        select: {
          year: true,
        },
      },
    },
    orderBy: [{ producer: { name: 'asc' } }, { movie: { year: 'asc' } }],
  })

  const producerWinYears: Record<string, number[]> = {}
  producerWins.forEach((producerWin) => {
    const producerName = producerWin.producer.name
    const year = producerWin.movie.year
    if (!producerWinYears[producerName]) {
      producerWinYears[producerName] = []
    }
    producerWinYears[producerName].push(year)
  })

  // Calculate intervals between wins for each producer
  const intervals: Interval[] = []

  Object.keys(producerWinYears).forEach((producerName) => {
    // Skip producers with less than 2 wins
    const years = producerWinYears[producerName]
    if (years.length < 2) return

    // Calculate intervals between wins
    for (let i = 1; i < years.length; i++) {
      const previousWin = years[i - 1]
      const followingWin = years[i]
      const interval = followingWin - previousWin
      intervals.push({
        producer: producerName,
        interval,
        previousWin,
        followingWin,
      })
    }
  })

  if (intervals.length === 0) {
    return { min: [], max: [] }
  }

  // Find min and max intervals
  const minInterval = Math.min(...intervals.map((i) => i.interval))
  const maxInterval = Math.max(...intervals.map((i) => i.interval))

  // Filter producers with min and max intervals
  const minProducers = intervals.filter((i) => i.interval === minInterval)
  const maxProducers = intervals.filter((i) => i.interval === maxInterval)

  return {
    min: minProducers,
    max: maxProducers,
  }
}
