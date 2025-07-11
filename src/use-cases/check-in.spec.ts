import { describe, beforeEach, expect, it, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in-use-case'
import { InMemoryCheckInsRepositories } from '@/repositories/in-memory/in-memory-checkins-repositories'
import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repositories'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-invalid-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

// Declare variables for the repositories and use case
let checkInsRepositories: InMemoryCheckInsRepositories
let gymsRepositories: InMemoryGymsRepositories
let sut: CheckInUseCase // SUT = System Under Test

describe('Check-In Use Case', () => {
  beforeEach(async () => {
    checkInsRepositories = new InMemoryCheckInsRepositories()
    gymsRepositories = new InMemoryGymsRepositories()
    sut = new CheckInUseCase(checkInsRepositories, gymsRepositories)

    await gymsRepositories.create({
      id: 'gym-01',
      title: 'Gym Ronald',
      description: '',
      phone: '',
      latitude: -23.2879502,
      longitude: -45.8943738,
    })

    vi.useFakeTimers() // Mock time
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.2879502,
      userLongitude: -45.8943738,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2025, 6, 27, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.2879502,
      userLongitude: -45.8943738,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.2879502,
        userLongitude: -45.8943738,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but on different days', async () => {
    vi.setSystemTime(new Date(2025, 6, 27, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.2879502,
      userLongitude: -45.8943738,
    })

    vi.setSystemTime(new Date(2025, 6, 28, 8, 0, 0))

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.2879502,
        userLongitude: -45.8943738,
      }),
    ).resolves.toBeTruthy()
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepositories.items.push({
      id: 'gym-02',
      title: 'Gym Ronald',
      description: '',
      phone: '',
      latitude: new Decimal(-23.1144303),
      longitude: new Decimal(-45.2434252),
    })

    await expect(
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.2879502,
        userLongitude: -45.8943738,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
