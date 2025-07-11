import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  findById: (id: string) => Promise<Gym | null> // info: Search id of gym!
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
