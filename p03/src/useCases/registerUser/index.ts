import { hash } from "bcryptjs"
import { UsersRepository } from "../../repositories/users-repository"
import { UserAlreadyExistsError } from "../errors/userExists"

interface IRegisterUserCase {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async handle({ name, email, password }: IRegisterUserCase) {
    const userExists = await this.usersRepository.findByEmail(email)

    if (userExists) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
