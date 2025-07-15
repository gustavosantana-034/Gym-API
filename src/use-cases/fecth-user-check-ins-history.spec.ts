import { describe, beforeEach, expect, it } from 'vitest'
import { InMemoryCheckInsRepositories } from '@/repositories/in-memory/in-memory-checkins-repositories'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

// Declare variables for the repositories and the use case
let checkInsRepositories: InMemoryCheckInsRepositories // Mock repository to simulate check-in data
let sut: FetchUserCheckInsHistoryUseCase // SUT = System Under Test (the use case we're testing)

describe('Fetch User Check-In History Use Case', () => {
  // This runs before each test, resetting the repository and the use case instance
  beforeEach(async () => {
    checkInsRepositories = new InMemoryCheckInsRepositories() // Create a fresh in-memory repository
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepositories) // Instantiate the use case with the repository
  })

  // Test case: should return all check-ins for a given user
  it('should be able to fetch check-in history', async () => {
    // Arrange: create two check-ins in the repository for the same user
    await checkInsRepositories.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await checkInsRepositories.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    // Act: execute the use case with userId 'user-01'
    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    // Assert: verify the returned check-ins match the created ones
    expect(checkIns).toHaveLength(2) // Should return 2 check-ins
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }), // Check-in to gym-01
      expect.objectContaining({ gym_id: 'gym-02' }), // Check-in to gym-02
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepositories.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
