import { FastifyInstance } from "fastify";
import { register } from "./controllers/register.controller";
import { authenticate } from "./controllers/authenticate.controller";
import { profile } from "./controllers/profile";
import { verifyJWT } from "./middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  /** Rotas Autenticada */
  app.get("/me", { onRequest: [verifyJWT] }, profile);
}
