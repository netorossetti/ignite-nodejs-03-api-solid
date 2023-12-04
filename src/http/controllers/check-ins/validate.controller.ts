import { FastifyRequest, FastifyReply } from "fastify";
import { makeValidateCheckInUseCase } from "src/use-cases/factories/make-validate-check-in";
import { z } from "zod";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckinParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckinParamsSchema.parse(request.params);

  const validateCheckinUseCase = makeValidateCheckInUseCase();

  await validateCheckinUseCase.execute({
    checkInId,
  });

  return reply.status(204).send();
}
