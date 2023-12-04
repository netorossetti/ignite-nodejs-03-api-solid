import { FastifyRequest, FastifyReply } from "fastify";
import { makeCheckinUseCase } from "src/use-cases/factories/make-check-in";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsScehma = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInParamsScehma.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const createGymUseCases = makeCheckinUseCase();

  await createGymUseCases.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
