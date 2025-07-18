import { GetUserMetricsUseCase } from '../get-user-metrics'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export const makeGetUserMetricsUseCase = () => {
  const checkInsUsersRepository = new PrismaCheckInsRepository()
  const useCase = new GetUserMetricsUseCase(checkInsUsersRepository)

  return useCase
}
