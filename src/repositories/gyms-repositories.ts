import { Gym } from '@prisma/client'

export interface GymsRepository {
  findById: (id: string) => Promise<Gym | null> // info: Search id of gym!
}
