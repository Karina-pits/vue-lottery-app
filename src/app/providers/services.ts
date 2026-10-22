import { AuthService } from '@/entities/session';
import { UserService } from '@/entities/user';
import { ServiceProvider } from '@/shared/api';

/**
 * Реєстрація конкретних сервісів у універсальному реєстрі ServiceProvider.
 * Шар app може імпортувати з будь-яких шарів, тому реєстрація живе саме тут.
 */
export function registerServices(): void {
  ServiceProvider.register('users', () => new UserService());
  ServiceProvider.register('auth', () => new AuthService());
}
