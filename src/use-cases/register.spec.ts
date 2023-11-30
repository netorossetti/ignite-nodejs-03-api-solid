import { expect, test, describe, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "src/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  test("Deve ser possível se cadastrar", async () => {
    const { user } = await sut.execute({
      name: "Usuário 2",
      email: "email.do.usuario@email.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  test("A senha do usuário precisa estar criptografada", async () => {
    const { user } = await sut.execute({
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

  test("O usuário não deve poder se cadastrar com um e-mail duplicado", async () => {
    const email = "email.do.usuario@email.com";

    await sut.execute({
      name: "Usuário 1",
      email,
      password: "123456",
    });

    expect(async () => {
      await sut.execute({
        name: "Usuário 2",
        email,
        password: "123456",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
