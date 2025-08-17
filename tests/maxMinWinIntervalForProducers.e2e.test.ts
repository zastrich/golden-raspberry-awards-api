import { describe, it, expect } from 'vitest'
import { buildApp } from '@src/app'

interface Interval {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

describe('GET /api/movies/maxMinWinIntervalForProducers', () => {
  it('returns min e max defined on dataset', async () => {
    const app = await buildApp('./tests/fixtures/movies-test.csv')

    const res = await app.inject({
      method: 'GET',
      url: '/api/movies/maxMinWinIntervalForProducers',
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()

    expect(body).toHaveProperty('min')
    expect(body).toHaveProperty('max')

    const hasMin = body.min.some(
      (x: Interval) =>
        x.producer === 'Joel Silver' &&
        x.interval === 1 &&
        x.previousWin === 1990 &&
        x.followingWin === 1991,
    )
    expect(hasMin).toBe(true)

    const hasMax = body.max.some(
      (x: Interval) =>
        x.producer === 'Matthew Vaughn' &&
        x.interval === 13 &&
        x.previousWin === 2002 &&
        x.followingWin === 2015,
    )
    expect(hasMax).toBe(true)
  })
})
