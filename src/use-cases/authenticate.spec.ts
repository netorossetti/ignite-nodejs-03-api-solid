import { expect, test, describe } from "vitest";
import { compare, hash } from "bcryptjs";
import { InMemoryUsersRepository } from "src/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate Use Case", () => {
  test("Deve ser possível se autenticar", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "Usuário",
      email: "email.do.usuario@email.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "email.do.usuario@email.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  test("Não deve ser possível se autenticar com um email inválido", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    expect(async () => {
      await sut.execute({
        email: "email.do.usuario@email.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("Não deve ser possível se autenticar com uma senha inválida", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "Usuário",
      email: "email.do.usuario@email.com",
      password_hash: await hash("123456", 6),
    });

    expect(async () => {
      await sut.execute({
        email: "email.do.usuario@email.com",
        password: "654321",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
