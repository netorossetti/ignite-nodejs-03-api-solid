import { expect, test, describe, beforeEach, vi, afterEach } from "vitest";
import { InMemoryGymsRepository } from "src/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  test("Deve ser possível buscar academias pelo nome", async () => {
    await gymsRepository.create({
      title: "Academia 1",
      description: null,
      phone: null,
      latitude: -21.7897478,
      longitude: -43.3586176,
    });
    await gymsRepository.create({
      title: "Academia 2",
      description: null,
      phone: null,
      latitude: -21.7897478,
      longitude: -43.3586176,
    });

    const { gyms } = await sut.execute({
      query: "Academia 2",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Academia 2" })]);
  });

  test("Deve ser possível buscar academias pelo nome e obter uma lista paginada", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Academia ${i}`,
        description: null,
        phone: null,
        latitude: -21.7897478,
        longitude: -43.3586176,
      });
    }

    const { gyms } = await sut.execute({
      query: "Academia",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Academia 21" }),
      expect.objectContaining({ title: "Academia 22" }),
    ]);
  });
});
