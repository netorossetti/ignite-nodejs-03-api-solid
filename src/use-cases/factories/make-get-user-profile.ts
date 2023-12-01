import { GetUserProfileUseCase } from "../get-user-profile";
import { PrismaUsersRepository } from "src/repositories/prisma/prisma-users-repository";

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

  return getUserProfileUseCase;
}
