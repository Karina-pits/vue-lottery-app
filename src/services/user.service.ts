import { http } from '@/api/http-client';
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user';
import type {
  Creatable,
  Deletable,
  Editable,
  ListParams,
  PagedResult,
  Readable,
  Searchable,
} from './interfaces';

interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

function toPagedResult(data: UsersResponse): PagedResult<User> {
  return { items: data.users, total: data.total, skip: data.skip, limit: data.limit };
}

export class UserService
  implements
    Readable<User>,
    Searchable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable<User>
{
  async getAll({ limit = 10, skip = 0 }: ListParams = {}): Promise<PagedResult<User>> {
    const data = await http<UsersResponse>('/users', { query: { limit, skip } });
    return toPagedResult(data);
  }

  async search(
    query: string,
    { limit = 10, skip = 0 }: ListParams = {},
  ): Promise<PagedResult<User>> {
    const data = await http<UsersResponse>('/users/search', { query: { q: query, limit, skip } });
    return toPagedResult(data);
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`);
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', { method: 'POST', body: data });
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'PUT', body: data });
  }

  delete(id: number): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'DELETE' });
  }
}
