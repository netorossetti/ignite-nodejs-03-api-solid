import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeSearchGymsUseCase } from "src/use-cases/factories/make-search-gyms";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymQuerySchema.parse(request.query);

  const searchGymUseCases = makeSearchGymsUseCase();

  const { gyms } = await searchGymUseCases.execute({ query, page });

  return reply.status(200).send({ gyms });
}
