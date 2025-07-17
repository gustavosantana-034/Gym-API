import { describe, beforeEach, expect, it, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepositories } from '@/repositories/in-memory/in-memory-checkins-repositories'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

// Declare variables for the repositories and use case
let checkInsRepositories: InMemoryCheckInsRepositories
let sut: ValidateCheckInUseCase // SUT = System Under Test

describe('Validate Check-In Use Case', () => {
  beforeEach(async () => {
    checkInsRepositories = new InMemoryCheckInsRepositories()
    sut = new ValidateCheckInUseCase(checkInsRepositories)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check-in', async () => {
    const createdCheckIn = await checkInsRepositories.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
      userId: 'user-id',
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepositories.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
        userId: 'user-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 6, 1, 13, 40)) // 1º de julho de 2025, 13:40

    const createdCheckIn = await checkInsRepositories.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
        userId: 'user-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
