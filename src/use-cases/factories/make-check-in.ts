import { PrismaGymsRepository } from "src/repositories/prisma/prisma-gyms-repository";
import { CheckinUseCase } from "../check-in";
import { PrismaCheckInsRepository } from "src/repositories/prisma/prisma-check-ins-repository";

export function makeCheckinUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const checkinUseCase = new CheckinUseCase(checkInsRepository, gymsRepository);

  return checkinUseCase;
}
