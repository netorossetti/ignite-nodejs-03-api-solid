import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserProfileUseCase } from "src/use-cases/factories/make-get-user-profile";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify();
  const getUserProfile = makeGetUserProfileUseCase();

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  });

  console.log(user);

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
