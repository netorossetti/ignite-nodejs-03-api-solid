import request from "supertest";
import { app } from "src/app";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createAndAuthenticateUser } from "src/utils/test/create-and-autheticate-user";
import { prisma } from "src/lib/prisma";

describe("Check-In History (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("Deve ser possível recuperar um hitórico de check-ins", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();
    const gym = await prisma.gym.create({
      data: {
        title: "Javascript Gym",
        description: "Some description",
        phone: "32999887766",
        latitude: -21.7897478,
        longitude: -43.3586176,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get("/check-ins/history")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toHaveLength(2);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ]);
  });
});
