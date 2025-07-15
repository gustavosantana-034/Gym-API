import { describe, beforeEach, expect, it } from 'vitest'
import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repositories'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepositories
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepositories()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -23.2879502,
      longitude: -45.8943738,
    })
    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -22.9333842,
      longitude: -45.4502529,
    })

    // Act: execute the query to find a specific gym nearby to my location
    const { gyms } = await sut.execute({
      userLatitude: -23.2879502,
      userLongitude: -45.8943738,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
