import request from "supertest";
import { app } from "src/app";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createAndAuthenticateUser } from "src/utils/test/create-and-autheticate-user";
import { prisma } from "src/lib/prisma";

describe("Check-In Create (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("Deve ser possível criar um check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "Javascript Gym",
        description: "Some description",
        phone: "32999887766",
        latitude: -21.7897478,
        longitude: -43.3586176,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -21.7897478,
        longitude: -43.3586176,
      });

    expect(response.statusCode).toEqual(201);
  });
});
