import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInUseCase } from '../check-in-use-case'
import { PrismaGymsRepository } from '@/repositories/prisma/primsa-gyms-repository'

export const makeCheckInUseCase = () => {
  const CheckInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()

  const useCase = new CheckInUseCase(CheckInsRepository, gymsRepository)

  return useCase
}
