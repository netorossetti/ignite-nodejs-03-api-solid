import { hash } from "bcryptjs";
import { prisma } from "src/lib/prisma";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersReposytory: any) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (userWithSameEmail) {
      throw new Error("Email already exists");
    }

    await this.usersReposytory.create({
      name,
      email,
      password_hash,
    });
  }
}
