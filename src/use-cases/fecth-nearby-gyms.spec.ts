import { expect, test, describe, beforeEach, vi, afterEach } from "vitest";
import { InMemoryGymsRepository } from "src/repositories/in-memory/in-memory-gyms-repository";
import { FecthNearByGymsUseCase } from "./fecth-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FecthNearByGymsUseCase;

describe("Fecth Near By Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FecthNearByGymsUseCase(gymsRepository);
  });

  test("Deve ser possível o usuário buscar academias proximas", async () => {
    await gymsRepository.create({
      title: "Academia Proxima",
      description: null,
      phone: null,
      latitude: -21.7897478,
      longitude: -43.3586176,
    });
    await gymsRepository.create({
      title: "Academia Distante",
      description: null,
      phone: null,
      latitude: -21.855656,
      longitude: -43.013927,
    });

    const { gyms } = await sut.execute({
      userLatitude: -21.7897478,
      userLongitude: -43.3586176,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Academia Proxima" }),
    ]);
  });

  // test("Deve ser possível o usuário buscar academias proximas em uma lista paginada", async () => {
  //   for (let i = 1; i <= 22; i++) {
  //     await gymsRepository.create({
  //       title: `Academia ${i}`,
  //       description: null,
  //       phone: null,
  //       latitude: -21.7897478,
  //       longitude: -43.3586176,
  //     });
  //   }

  //   const { gyms } = await sut.execute({
  //     query: "Academia",
  //     page: 2,
  //   });

  //   expect(gyms).toHaveLength(2);
  //   expect(gyms).toEqual([
  //     expect.objectContaining({ title: "Academia 21" }),
  //     expect.objectContaining({ title: "Academia 22" }),
  //   ]);
  // });
});
