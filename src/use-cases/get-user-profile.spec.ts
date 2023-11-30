import { expect, test, describe, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "src/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileCase(usersRepository);
  });

  test("Deve ser possível obter o perfil de um usuário", async () => {
    const createdUser = await usersRepository.create({
      name: "Usuário",
      email: "email.do.usuario@email.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("Usuário");
  });

  test("Não deve ser possível obter o perfil de um usuário", async () => {
    expect(async () => {
      await sut.execute({
        userId: "non-existing-id",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
