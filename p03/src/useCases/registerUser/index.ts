import { hash } from "bcryptjs"
import { prisma } from "../../lib/prisma"

interface IRegisterUserCase {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async handle({ name, email, password }: IRegisterUserCase) {
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userExists) {
      throw new Error("User already exists.")
    }

    //const prismaUsersRepository = new PrismaUsersRepository()

    const password_hash = await hash(password, 6)

    await this.usersRepository.create({ name, email, password_hash })
  }
}
