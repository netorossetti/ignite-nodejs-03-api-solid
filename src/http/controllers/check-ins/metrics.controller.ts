import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserMetricsUseCase } from "src/use-cases/factories/make-get-user-metrics";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsUseCases = makeGetUserMetricsUseCase();

  const { checkInsCount } = await getUserMetricsUseCases.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkInsCount });
}
