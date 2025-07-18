import { PrismaGymsRepository } from '@/repositories/prisma/primsa-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms'

export const makeSearchGymsUseCase = () => {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCase(gymsRepository)

  return useCase
}
