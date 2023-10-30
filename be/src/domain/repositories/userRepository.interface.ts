import { User } from 'src/infrastructure/entities/user.entity';
import { UserM } from '../model/user';
import { AuthRegisterDto } from 'src/infrastructure/controllers/auth/auth.dto';

export interface UserRepository {
  createUser(newUser: AuthRegisterDto): Promise<User>;
  getUserByEmail(email: string): Promise<UserM>;
  updateLastLogin(email: string): Promise<void>;
  updateRefreshToken(email: string, refreshToken: string): Promise<void>;
}
