/**
 * Учасник лотереї.
 */
export interface Participant {
  id: string;
  name: string;
  dateOfBirth: string; // формат yyyy-mm-dd (значення <input type="date">)
  email: string;
  phone: string; // формат +380XXXXXXXXX
}

/** Дані форми реєстрації/редагування учасника (без id). */
export type ParticipantFormData = Omit<Participant, 'id'>;

/** Напрямок сортування таблиці учасників. */
export type SortDirection = 'asc' | 'desc';

/** Поле, за яким можна сортувати таблицю учасників. */
export type SortField = 'name' | 'dateOfBirth';
