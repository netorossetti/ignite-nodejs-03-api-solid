import { ValidateCheckinUseCase } from "../validate-check-in";
import { PrismaCheckInsRepository } from "src/repositories/prisma/prisma-check-ins-repository";

export function makeValidateCheckinUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const validateCheckinUseCase = new ValidateCheckinUseCase(checkInsRepository);

  return validateCheckinUseCase;
}
