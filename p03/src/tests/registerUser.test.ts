import { compare } from "bcryptjs"
import { describe, expect, it } from "vitest"
import { MemoryUsersRepository } from "../repositories/memory/memory-users-respository"
import { UserAlreadyExistsError } from "../useCases/errors/userExists"
import { RegisterUseCase } from "../useCases/registerUser"

describe("Register User - service", () => {
  it("should be able to register user", async () => {
    const usersRepository_test = new MemoryUsersRepository()
    const registerUseCase_test = new RegisterUseCase(usersRepository_test)

    const { user } = await registerUseCase_test.handle({
      name: "Pamonha Jr",
      email: "pamonha@gmail.com",
      password: "gostodepamonha",
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("should hash user password when register", async () => {
    const usersRepository_test = new MemoryUsersRepository()
    const registerUseCase_test = new RegisterUseCase(usersRepository_test)

    const { user } = await registerUseCase_test.handle({
      name: "Pamonha Jr",
      email: "pamonha@gmail.com",
      password: "gostodepamonha",
    })

    const isValidHash = await compare("gostodepamonha", user.password_hash)

    expect(isValidHash).toBe(true)
  })

  it("should not be able to register with duplicate emails", async () => {
    const usersRepository_test = new MemoryUsersRepository()
    const registerUseCase_test = new RegisterUseCase(usersRepository_test)

    const email = "pamonha@gmail.com"

    await registerUseCase_test.handle({
      name: "Pamonha Jr",
      email,
      password: "gostodepamonha",
    })

    await expect(() =>
      registerUseCase_test.handle({
        name: "Pamonha Jr",
        email,
        password: "gostodepamonha",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
