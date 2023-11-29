import { hash } from "bcryptjs";
import { UsersRepository } from "src/repositories/users-repository";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersReposytory: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersReposytory.findByEmail(email);
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
