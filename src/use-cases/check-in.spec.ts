import { expect, test, describe, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "src/repositories/in-memory/in-memory-check-ins-repository";
import { CheckinUseCase } from "./check-in";
import { InMemoryGymsRepository } from "src/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckinUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckinUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Gym 01",
      description: "Description Gym 01",
      phone: "032999998877",
      latitude: -21.7897478,
      longitude: -43.3586176,
    });

    // habilitar uso de datas fixas no new Date()
    vi.useFakeTimers();
  });

  afterEach(() => {
    // habilitar uso de datas reais no new Date() e desabilitar o vi.useFakeTimers()
    vi.useRealTimers();
  });

  test("Deve ser possível criar um check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -21.7897478,
      userLongitude: -43.3586176,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  test("Não deve ser possível criar check in para o mesmo usuário no mesmo dia", async () => {
    // Definir data fake para vitest
    vi.setSystemTime(new Date(2023, 0, 10, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -21.7897478,
      userLongitude: -43.3586176,
    });

    expect(async () => {
      await sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -21.7897478,
        userLongitude: -43.3586176,
      });
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  test("Deve ser possível criar check in para o mesmo usuário em dias diferentes", async () => {
    // Definir data fake para vitest
    vi.setSystemTime(new Date(2023, 0, 10, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -21.7897478,
      userLongitude: -43.3586176,
    });

    // Definir data fake para vitest
    vi.setSystemTime(new Date(2023, 0, 11, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -21.7897478,
      userLongitude: -43.3586176,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  test("O usuário não pode fazer check-in se não estiver perto da academia", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Gym 02",
      description: "Description Gym 02",
      phone: "032999998877",
      latitude: new Decimal(-21.7881539),
      longitude: new Decimal(-43.3563002),
    });

    expect(
      async () =>
        await sut.execute({
          userId: "user-01",
          gymId: "gym-02",
          userLatitude: -21.7897478,
          userLongitude: -43.3586176,
        })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
