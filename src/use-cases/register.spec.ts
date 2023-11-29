import { expect, test, describe } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";

describe("Register Use Case", () => {
  test("A senha do usuário precisa estar criptografada", async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return null;
      },
      async create(data) {
        return {
          id: "id-1",
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        };
      },
    });

    const { user } = await registerUseCase.execute({
      name: "Nome do Usuário",
      email: "email.do.usuario@email.com",
      password: "123456",
    });

    const isPasswordCorreclyHashed = await compare(
      "123456",
      user.password_hash
    );
    expect(isPasswordCorreclyHashed);
  });
});
