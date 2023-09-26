import { hash } from "bcryptjs"
import { prisma } from "../../lib/prisma"

interface IRegisterUserCase {
  name: string
  email: string
  password: string
}

export async function registerUser({
  name,
  email,
  password,
}: IRegisterUserCase) {
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userExists) {
    throw new Error("User already exists.")
  }

  const password_hash = await hash(password, 6)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })
}
