import { FetchUserCheckInsUseCase } from "../fetch-user-check-ins-history";
import { PrismaCheckInsRepository } from "src/repositories/prisma/prisma-check-ins-repository";

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const fetchUserCheckInsUseCase = new FetchUserCheckInsUseCase(
    checkInsRepository
  );

  return fetchUserCheckInsUseCase;
}
