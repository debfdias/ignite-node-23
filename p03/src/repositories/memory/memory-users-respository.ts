import { Prisma, Role, User } from "@prisma/client"
import { UsersRepository } from "../users-repository"

export class MemoryUsersRepository implements UsersRepository {
  public usersTable: User[] = []

  async findById(id: string): Promise<User | null> {
    const user = this.usersTable.find((user) => user.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.usersTable.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: "user_1",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      role: Role.MEMBER,
    }

    this.usersTable.push(user)

    return user
  }
}
