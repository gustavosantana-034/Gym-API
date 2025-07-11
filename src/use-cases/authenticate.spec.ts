import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepositories } from '@/repositories/in-memory/in-memory-users-repositories'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsErros } from './errors/invalid-credentials-error'

// Declare variables for the in-memory repository and the use case
let usersRepository: InMemoryUsersRepositories
let sut: AuthenticateUseCase // SUT = System Under Test

describe('Authenticate Use Case', () => {
  // Reset the repository and use case before each test
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepositories()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    // Create a user in the in-memory repository with a hashed password
    await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon@mail.com',
      password_hash: await hash('123456', 6),
    })

    // Attempt to authenticate with correct credentials
    const { user } = await sut.execute({
      email: 'jhon@mail.com',
      password: '123456',
    })

    // Check that a user ID is returned (authentication succeeded)
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    // Try to authenticate with an email that does not exist
    await expect(() =>
      sut.execute({
        email: 'jhon@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsErros)
  })

  it('should not be able to authenticate with wrong password', async () => {
    // Create a user with a known password
    await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon@mail.com',
      password_hash: await hash('123456', 6),
    })

    // Try to authenticate with the correct email but wrong password
    await expect(() =>
      sut.execute({
        email: 'jhon@mail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsErros)
  })
})
