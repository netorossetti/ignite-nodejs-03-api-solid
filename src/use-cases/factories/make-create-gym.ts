import { PrismaGymsRepository } from "src/repositories/prisma/prisma-gyms-repository";
import { CreateGymUseCase } from "../create-gym";

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const createGymUseCase = new CreateGymUseCase(gymsRepository);

  return createGymUseCase;
}
