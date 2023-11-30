import { expect, test, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "src/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  test("Deve ser possível cadastrar uma academia", async () => {
    const { gym } = await sut.execute({
      title: "Usuário 2",
      description: null,
      phone: null,
      latitude: -21.7897478,
      longitude: -43.3586176,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
