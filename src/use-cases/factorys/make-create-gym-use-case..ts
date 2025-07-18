import { PrismaGymsRepository } from '@/repositories/prisma/primsa-gyms-repository'
import { CreateGymUseCase } from '../create-gyms-use-case'

export const makeCreateGymUseCase = () => {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(gymsRepository)

  return useCase
}
