/**
 * Чисті функції валідації для форми реєстрації/редагування учасника.
 * Жодна з них не звертається до DOM чи стану компонента — усі приймають
 * значення та повертають або `null` (валідно), або текст помилки.
 */

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// +380 та рівно 9 цифр після коду країни
const PHONE_REGEXP = /^\+380\d{9}$/;

export function validateRequired(value: string, fieldLabel: string): string | null {
  return value.trim().length === 0 ? `Поле «${fieldLabel}» є обов'язковим.` : null;
}

export function validateEmailFormat(value: string): string | null {
  return EMAIL_REGEXP.test(value.trim()) ? null : 'Некоректний формат email.';
}

export function validatePhoneFormat(value: string): string | null {
  return PHONE_REGEXP.test(value.trim())
    ? null
    : 'Телефон має бути у форматі +380XXXXXXXXX (код країни та 9 цифр).';
}

export function validateDateOfBirth(value: string): string | null {
  if (!value) {
    return null; // обов'язковість перевіряється окремо через validateRequired
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Некоректна дата.';
  }
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return parsed.getTime() > today.getTime() ? 'Дата народження не може бути у майбутньому.' : null;
}

export interface ParticipantFormErrors {
  name?: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
}

export interface ParticipantFormValues {
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

/**
 * Перевіряє всі поля форми учасника одразу та повертає об'єкт помилок
 * (порожній об'єкт означає, що форма валідна).
 */
export function validateParticipantForm(values: ParticipantFormValues): ParticipantFormErrors {
  const errors: ParticipantFormErrors = {};

  errors.name = validateRequired(values.name, "Ім'я") ?? undefined;

  const dateRequiredError = validateRequired(values.dateOfBirth, 'Дата народження');
  errors.dateOfBirth = dateRequiredError ?? validateDateOfBirth(values.dateOfBirth) ?? undefined;

  const emailRequiredError = validateRequired(values.email, 'Email');
  errors.email = emailRequiredError ?? validateEmailFormat(values.email) ?? undefined;

  const phoneRequiredError = validateRequired(values.phone, 'Телефон');
  errors.phone = phoneRequiredError ?? validatePhoneFormat(values.phone) ?? undefined;

  // Прибираємо undefined-ключі, щоб Object.keys(errors).length коректно показував валідність
  (Object.keys(errors) as (keyof ParticipantFormErrors)[]).forEach((key) => {
    if (errors[key] === undefined) {
      delete errors[key];
    }
  });

  return errors;
}

export function isFormValid(errors: ParticipantFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
