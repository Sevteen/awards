import { UserM, UserWithoutPassword } from '../../domain/model/user';
import { UserRepository } from '../../domain/repositories/userRepository.interface';

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: UserRepository) {}

  async execute(email: string): Promise<Omit<UserWithoutPassword, 'hashRefreshToken'>> {
    const user: UserM = await this.adminUserRepo.getUserByEmail(email);
    const { password, hashRefreshToken, ...info } = user;
    return info;
  }
}
