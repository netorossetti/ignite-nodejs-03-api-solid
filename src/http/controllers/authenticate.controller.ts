import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "src/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "src/use-cases/authenticate";
import { InvalidCredentialsError } from "src/use-cases/errors/invalid-credentials-error";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCases = new AuthenticateUseCase(usersRepository);

    await authenticateUseCases.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(200).send();
}
