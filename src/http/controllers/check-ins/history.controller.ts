import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchUserCheckInsHistoryUseCase } from "src/use-cases/factories/make-fetch-user-check-ins-history";
import { z } from "zod";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const userCheckInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = userCheckInHistoryQuerySchema.parse(request.query);

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(200).send({ checkIns });
}
