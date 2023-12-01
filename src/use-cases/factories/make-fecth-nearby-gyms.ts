import { PrismaGymsRepository } from "src/repositories/prisma/prisma-gyms-repository";
import { FecthNearByGymsUseCase } from "../fecth-nearby-gyms";

export function makeFecthNearByGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const fecthNearByGymsUseCase = new FecthNearByGymsUseCase(gymsRepository);

  return fecthNearByGymsUseCase;
}
