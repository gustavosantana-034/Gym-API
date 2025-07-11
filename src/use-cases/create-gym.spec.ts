import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repositories'
import { CreateGymUseCase } from './create-gyms-use-case'

let gymsRepository: InMemoryGymsRepositories
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepositories()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym Ronald',
      description: null,
      phone: null,
      latitude: -23.2879502,
      longitude: -45.8943738,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
