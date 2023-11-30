import { expect, test, describe, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "src/repositories/in-memory/in-memory-check-ins-repository";
import { CheckinUseCase } from "./check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckinUseCase;

describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckinUseCase(checkInsRepository);
  });

  test("Deve ser possível criar um check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
