import { Gym } from "@prisma/client";
import { GymsRepository } from "src/repositories/gyms-repository";

interface FecthNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FecthNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FecthNearByGymsUseCase {
  constructor(private gymsReposytory: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FecthNearbyGymsUseCaseRequest): Promise<FecthNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsReposytory.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return {
      gyms,
    };
  }
}
