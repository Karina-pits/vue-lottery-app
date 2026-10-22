import { AuthService } from '@/entities/session/api/auth.service';
import { UserService } from '@/entities/user/api/user.service';

/**
 * Єдина точка отримання сервісів. Клієнтський код не створює
 * сервіси самостійно через `new`.
 */
export class ServiceProvider {
  private static userService?: UserService;
  private static authService?: AuthService;

  static get users(): UserService {
    this.userService ??= new UserService();
    return this.userService;
  }

  static get auth(): AuthService {
    this.authService ??= new AuthService();
    return this.authService;
  }
}
