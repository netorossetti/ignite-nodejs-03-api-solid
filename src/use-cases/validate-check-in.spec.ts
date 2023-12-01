import { expect, test, describe, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "src/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckinUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckinUseCase;

describe("Validate Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckinUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("Deve ser possível validar o check-in de um usuário", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  test("Não deve ser possível validar o check-in inexistente de um usuário", async () => {
    expect(
      async () =>
        await sut.execute({
          checkInId: "inexistent-check-in-id",
        })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  test("O check-in só pode ser validado até 20 minutos após ser criado", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const vinteUmMinutosEmMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(vinteUmMinutosEmMs);

    expect(
      async () =>
        await sut.execute({
          checkInId: createdCheckIn.id,
        })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
