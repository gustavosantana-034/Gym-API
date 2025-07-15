import { describe, beforeEach, expect, it } from 'vitest'
import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repositories'
import { SearchGymsUseCase } from './search-gyms'

// Declare variables for the repositories and the use case
let gymsRepository: InMemoryGymsRepositories // Mock repository to simulate check-in data
let sut: SearchGymsUseCase // SUT = System Under Test (the use case we're testing)

describe('Search Gyms Case', () => {
  // This runs before each test, resetting the repository and the use case instance
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepositories() // Create a fresh in-memory repository
    sut = new SearchGymsUseCase(gymsRepository) // Instantiate the use case with the repository
  })

  // Test case: should return all check-ins for a given user
  it('should be able to search for gyms', async () => {
    // Arrange: create two check-ins in the repository for the same user
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
