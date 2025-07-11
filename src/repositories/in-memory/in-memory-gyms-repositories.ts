import { Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repositories'

export class InMemoryGymsRepositories implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
