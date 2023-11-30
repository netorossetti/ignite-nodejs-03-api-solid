import { expect, test, describe, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "src/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  test("Deve ser possível se autenticar", async () => {
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
    expect(async () => {
      await sut.execute({
        email: "email.do.usuario@email.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("Não deve ser possível se autenticar com uma senha inválida", async () => {
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
