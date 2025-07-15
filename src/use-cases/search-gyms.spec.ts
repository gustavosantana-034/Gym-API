import { describe, beforeEach, expect, it } from 'vitest'
import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repositories'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepositories
let sut: SearchGymsUseCase

describe('Search Gyms Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepositories()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Gym Ronald',
      description: null,
      phone: null,
      latitude: -23.2879502,
      longitude: -45.8943738,
    })
    await gymsRepository.create({
      title: 'Gym Of Jeff',
      description: null,
      phone: null,
      latitude: -23.2879502,
      longitude: -45.8943738,
    })

    // Act: execute the query to find a specific gym
    const { gyms } = await sut.execute({
      query: 'Ronald',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym Ronald' })])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym Of Jeff ${i}`,
        description: null,
        phone: null,
        latitude: -23.2879502,
        longitude: -45.8943738,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Jeff',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym Of Jeff 21' }),
      expect.objectContaining({ title: 'Gym Of Jeff 22' }),
    ])
  })
})
