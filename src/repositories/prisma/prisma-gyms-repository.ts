import { Prisma, Gym } from "@prisma/client";

import { FindManyNearByParams, GymsRepository } from "../gyms-repository";
import { randomUUID } from "node:crypto";
import { getDistanceBetweenCoordinates } from "src/utils/get-distance-between-coordinates";
import { prisma } from "src/lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({ where: { id: id } });
    return gym;
  }

  async findManyNearBy({ latitude, longitude }: FindManyNearByParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
       WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;
    return gyms;
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: { title: { contains: query, mode: "insensitive" } },
      take: 20,
      skip: (page - 1) * 20,
    });
    return gyms;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data });
    return gym;
  }
}
