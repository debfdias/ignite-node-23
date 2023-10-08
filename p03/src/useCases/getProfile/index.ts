import { User } from "@prisma/client"
import { UsersRepository } from "../../repositories/users-repository"
import { NotFoundError } from "../errors/notFound"

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async handle({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new NotFoundError()
    }

    return {
      user,
    }
  }
}
