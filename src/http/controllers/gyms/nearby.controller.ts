import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFecthNearByGymsUseCase } from "src/use-cases/factories/make-fecth-nearby-gyms";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymQuerySchema.parse(request.query);

  const fecthNearByGymsUseCases = makeFecthNearByGymsUseCase();

  const { gyms } = await fecthNearByGymsUseCases.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ gyms });
}
