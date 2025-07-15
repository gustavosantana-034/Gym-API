import { describe, beforeEach, expect, it } from 'vitest'
import { InMemoryCheckInsRepositories } from '@/repositories/in-memory/in-memory-checkins-repositories'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepositories: InMemoryCheckInsRepositories
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepositories = new InMemoryCheckInsRepositories()
    sut = new GetUserMetricsUseCase(checkInsRepositories)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepositories.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await checkInsRepositories.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toBe(2)
  })
})
