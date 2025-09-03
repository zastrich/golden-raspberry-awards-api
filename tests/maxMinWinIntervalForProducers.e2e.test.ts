import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '@src/app'
import { FastifyInstance } from 'fastify'
import { closeDataSource } from '@src/db/dataSource.js'
import { getProducerWinIntervals } from '@src/controllers/producersController.js'
import { Interval } from './types.js'

describe('GET /api/movies/maxMinWinIntervalForProducers', () => {
  let app: FastifyInstance
  let expected: { min: Interval[]; max: Interval[] }

  beforeAll(async () => {
    app = await buildApp()
    expected = await getProducerWinIntervals()
  })

  afterAll(async () => {
    await app.close()
    await closeDataSource()
  })

  describe('API response', () => {
    let response: {
      statusCode: number
      json: () => { min: Interval[]; max: Interval[] }
    }
    let responseBody: { min: Interval[]; max: Interval[] }

    it('should start and return a valid response', async () => {
      response = await app.inject({
        method: 'GET',
        url: '/api/movies/maxMinWinIntervalForProducers',
      })

      expect(response.statusCode).toBe(200)
      responseBody = response.json()

      expect(responseBody).toHaveProperty('min')
      expect(responseBody).toHaveProperty('max')
      expect(Array.isArray(responseBody.min)).toBe(true)
      expect(Array.isArray(responseBody.max)).toBe(true)
    })

    it('should find producers with minimum interval between wins', () => {
      expected.min.forEach((expectedInterval: Interval) => {
        const found = responseBody.min.some(
          (x: Interval) =>
            x.producer === expectedInterval.producer &&
            x.interval === expectedInterval.interval &&
            x.previousWin === expectedInterval.previousWin &&
            x.followingWin === expectedInterval.followingWin,
        )
        expect(
          found,
          `Should find producer ${expectedInterval.producer} with interval ${expectedInterval.interval} ` +
            `between years ${expectedInterval.previousWin} and ${expectedInterval.followingWin}`,
        ).toBe(true)
      })

      // Garante que não há produtores extras não esperados
      expect(responseBody.min.length).toBe(expected.min.length)
    })

    it('should find producers with maximum interval between wins', () => {
      expected.max.forEach((expectedInterval: Interval) => {
        const found = responseBody.max.some(
          (x: Interval) =>
            x.producer === expectedInterval.producer &&
            x.interval === expectedInterval.interval &&
            x.previousWin === expectedInterval.previousWin &&
            x.followingWin === expectedInterval.followingWin,
        )
        expect(
          found,
          `Should find producer ${expectedInterval.producer} with interval ${expectedInterval.interval} ` +
            `between years ${expectedInterval.previousWin} and ${expectedInterval.followingWin}`,
        ).toBe(true)
      })

      // Garante que não há produtores extras não esperados
      expect(responseBody.max.length).toBe(expected.max.length)
    })
  })
})
