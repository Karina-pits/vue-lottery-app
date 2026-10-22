/**
 * Модель користувача за схемою DummyJSON (https://dummyjson.com/docs/users).
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: { color: string; type: string };
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: Address;
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: { coin: string; wallet: string; network: string };
  role: string;
}

/** Поля, які обов'язково передаються при створенні користувача (поля форми). */
export type UserFormFields =
  'firstName' | 'lastName' | 'email' | 'username' | 'password' | 'age' | 'gender' | 'phone';

export type CreateUserDto = Pick<User, UserFormFields> & Partial<Omit<User, 'id' | UserFormFields>>;

export type UpdateUserDto = Partial<CreateUserDto>;
