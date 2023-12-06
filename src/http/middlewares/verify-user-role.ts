import { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(roleToVerify: "ADMIN" | "MEMBER") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;
    console.log(role, roleToVerify, role !== roleToVerify);
    if (role !== roleToVerify) {
      return reply.status(401).send({ message: "Unauthorized." });
    }
  };
}
