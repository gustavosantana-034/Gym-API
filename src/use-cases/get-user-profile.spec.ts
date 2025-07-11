import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepositories } from '@/repositories/in-memory/in-memory-users-repositories'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

// Declare variables for the in-memory repository and the use case
let usersRepository: InMemoryUsersRepositories
let sut: GetUserProfileUseCase // SUT = System Under Test

describe('Get User Profile Use Case', () => {
  // Reset the repository and use case before each test
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepositories()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    // Create a user in the in-memory repository with a hashed password
    const createdUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon@mail.com',
      password_hash: await hash('123456', 6),
    })

    // Attempt to get the profile
    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('Jhon Doe')
  })

  it('should not be able to get user profile with non-existent id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
