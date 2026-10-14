/**
 * Узагальнені контракти репозиторію. Кожен інтерфейс описує одну
 * можливість, тому сервіс реалізує лише ті, які йому потрібні.
 */

export interface ListParams {
  limit?: number;
  skip?: number;
}

/** Сторінка результатів (відповідь API з пагінацією). */
export interface PagedResult<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface Readable<T> {
  getAll(params?: ListParams): Promise<PagedResult<T>>;
  getById(id: number): Promise<T>;
}

export interface Searchable<T> {
  search(query: string, params?: ListParams): Promise<PagedResult<T>>;
}

export interface Creatable<T, TCreate = Partial<T>> {
  create(data: TCreate): Promise<T>;
}

export interface Editable<T, TUpdate = Partial<T>> {
  update(id: number, data: TUpdate): Promise<T>;
}

export interface Deletable<T> {
  delete(id: number): Promise<T>;
}
