import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "src/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

interface ValidateCheckinUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckinUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckinUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckinUseCaseRequest): Promise<ValidateCheckinUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId);
    if (!checkIn) {
      throw new ResourceNotFoundError();
    }
    const validatedAt = new Date();
    const distanceInMinutesFromCheckInCreation = dayjs(validatedAt).diff(
      checkIn.created_at,
      "minutes"
    );

    const MAX_MINUTES_TOLERANCE_TIMEOUT = 20;
    if (distanceInMinutesFromCheckInCreation > MAX_MINUTES_TOLERANCE_TIMEOUT) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = validatedAt;
    await this.checkInRepository.save(checkIn);

    return { checkIn };
  }
}
