# vue-lottery-app

Лабораторна робота №5 — **керування маршрутами з vue-router**, патерн **Repository** та
**JWT-авторизація** (гілка `feature/routing`).
Стек: Vue 3 (Composition API) + TypeScript, Vue Router, Pinia, VeeValidate + yup,
Bootstrap 5 (SCSS, лише потрібні партиали), Vite, ESLint + Prettier.
API: публічний [DummyJSON](https://dummyjson.com) (Users + Auth).

## Запуск

```bash
npm install
cp .env.example .env     # на Windows: copy .env.example .env
npm run dev              # dev-сервер
npm run build            # vue-tsc + збірка у dist/ (+ dist/404.html для GitHub Pages)
npm run lint             # ESLint
```

Тестовий акаунт для входу: **emilys / emilyspass**.

### Змінні оточення (`.env`)

| Змінна           | Призначення                                                    |
| ---------------- | -------------------------------------------------------------- |
| `VITE_API_URL`   | базова адреса API (`https://dummyjson.com`)                    |
| `VITE_BASE_PATH` | базовий шлях застосунку (`/` локально, `/vue-lottery-app/` на gh-pages) |

Файл `.env` не комітиться (є в `.gitignore`), у репозиторії лежить `.env.example`.

## Структура

```
src/
├── api/http-client.ts          # єдине місце з fetch, VITE_API_URL, помилки, interceptor (refresh при 401)
├── services/
│   ├── interfaces.ts           # Readable<T>, Searchable<T>, Creatable<T>, Editable<T>, Deletable<T>
│   ├── user.service.ts         # UserService (репозиторій користувачів)
│   ├── auth.service.ts         # AuthService (login, me, refresh)
│   └── service-provider.ts     # фабрика ServiceProvider.users / ServiceProvider.auth
├── types/                      # User, CreateUserDto, UpdateUserDto, типи авторизації
├── stores/                     # Pinia: auth (JWT + localStorage), users, winners
├── router/index.ts             # маршрути, guards, meta, afterEach (title)
├── layouts/                    # DefaultLayout, AuthLayout (через meta.layout)
├── views/                      # Home, About, Login, Users, UserDetails, UserEdit, NotFound
├── components/                 # AppHeader, AppNavigation, Logo, UsersTable, UserForm, Modal, ...
└── constants/author.ts         # дані автора та посилання на GitHub (Home / About)
```

## Маршрути

| URL               | Сторінка        | Примітки                                              |
| ----------------- | --------------- | ----------------------------------------------------- |
| `/`               | Home            | опис проєкту, технології, посилання на GitHub          |
| `/about`          | About author    | ПІБ, Technical skills, GitHub                          |
| `/login`          | Login           | `meta.layout = 'auth'`, `guestOnly`                    |
| `/users`          | Users           | `requiresAuth`, `?page=2&q=john` — стан у query        |
| `/users/:id`      | User details    | `props: true`, `requiresAuth`                          |
| `/users/:id/edit` | Edit user       | **вкладений** маршрут у `/users/:id`                   |
| `/:pathMatch(.*)*`| 404             | посилання на головну                                   |

Усі сторінки завантажуються лінивo (`() => import(...)`) — у збірці вони окремі чанки.

## Як працює авторизація

1. `POST /auth/login` → `accessToken`, `refreshToken` і дані користувача зберігаються в Pinia-сторі
   (`stores/auth.ts`) та в `localStorage` (через `watch`).
2. Захищені запити (`GET /auth/me`) додають заголовок `Authorization: Bearer <accessToken>`.
3. **Interceptor** у `http-client.ts`: якщо відповідь 401 — один раз викликається
   `POST /auth/refresh`, токен оновлюється й запит повторюється. Якщо кілька запитів отримали 401
   одночасно, токен оновлюється лише один раз. Якщо refresh не вдався — користувача розлогінює.
4. **Guard** `router.beforeEach`: маршрути з `meta.requiresAuth` (`/users` і вкладені) недоступні
   гостям → редірект на `/login?redirect=<запитана сторінка>`; після логіну користувач повертається
   на неї. Авторизований користувач на `/login` перенаправляється на `/users`.
   Значення `redirect` перевіряється (лише внутрішні шляхи), щоб уникнути open redirect.
5. Кнопка **Logout** замість Login очищує токени й веде на `/login`.

## Особливості DummyJSON

POST / PUT / DELETE лише **імітуються**: сервер відповідає коректно, але дані не змінюються.
Тому після успішної відповіді `stores/users.ts` сам оновлює локальний стан (додає, замінює,
видаляє) і запам'ятовує ці зміни, щоб вони не зникали при переході між сторінками.
Усі створені користувачі отримують від сервера один і той самий `id` (209) — тому застосунок
видає їм унікальні локальні id. Після перезавантаження сторінки локальні зміни зникають
(це очікувано для fake API).

## Деплой на gh-pages

Варіант 1 — вручну (з гілки `feature/routing`):

```bash
npm run deploy
```

Скрипт збирає проєкт з `VITE_BASE_PATH=/vue-lottery-app/` і публікує `dist/` у гілку `gh-pages`.

Варіант 2 — автоматично: `.github/workflows/deploy.yml` збирає й публікує гілку при кожному
пуші в `feature/routing`.

У налаштуваннях репозиторію: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / root**.
Адреса: `https://<username>.github.io/vue-lottery-app/`.

## Контрольні запитання

1. **Що таке патерн Repository?** Це клас, який ховає всю роботу з джерелом даних (API, БД, файл)
   за простими методами (`getAll`, `getById`, `create`...). Решта програми викликає ці методи і
   нічого не знає про `fetch` чи URL. У проєкті це `UserService` та `AuthService`.

2. **З чого складається патерн?** Модель (`User`), інтерфейси-контракти (`Readable`, `Creatable`,
   `Editable`, `Deletable`), сам репозиторій (`UserService`), HTTP-клієнт (`http-client.ts`),
   фабрика `ServiceProvider` та клієнтський код (компоненти й Pinia-сторі).

3. **Роль моделі.** Модель описує, які дані ми зберігаємо й отримуємо (поля `User`, типи
   `CreateUserDto`, `UpdateUserDto`). Завдяки їй TypeScript перевіряє, що ми не помилились у полях.

4. **Як патерн відокремлює доступ до даних?** Компоненти не викликають `fetch`, а лише
   `ServiceProvider.users.getAll()`. Якщо зміниться API чи формат відповіді — правимо лише
   сервіс, а компоненти й сторі лишаються без змін.

5. **Як патерн допомагає тестуванню?** Клієнтський код залежить від інтерфейсу (`Readable<User>`),
   а не від конкретного класу. У тесті можна підставити фейковий сервіс з готовими даними —
   без мережі й реального сервера.

6. **Переваги.** Розділення відповідальностей, легше тестувати, код доступу до даних
   використовується повторно, можна замінити джерело даних (інший API, localStorage), менше
   дублювання коду й помилок.

7. **Що таке Vue Router?** Офіційна бібліотека маршрутизації. Вона показує потрібний компонент
   залежно від URL без перезавантаження сторінки (SPA), працює з параметрами URL, guards,
   вкладеними маршрутами й ліниво завантажує сторінки.

8. **Як оголошуються маршрути?** Масивом `routes` у `createRouter`: кожен маршрут — це `path` +
   `component` (і за потреби `name`, `meta`, `props`, `children`), наприклад
   `{ path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') }`.

9. **RouterLink vs RouterView.** `RouterLink` — це посилання для переходу на інший маршрут без
   перезавантаження (додає клас активного пункту). `RouterView` — місце в шаблоні, куди роутер
   підставляє компонент поточного маршруту.

10. **Як передати параметри в компонент?** Через динамічний сегмент (`/users/:id`) і опцію
    `props: true` — тоді `id` приходить у компонент як звичайний prop
    (`defineProps<{ id: string }>()`), а не через `useRoute().params`.

11. **Вкладені маршрути.** Роблять через `children`: дочірній маршрут `edit` всередині
    `/users/:id` дає адресу `/users/:id/edit`. Його компонент відображається у `<RouterView>`
    батьківського компонента (`UserDetailsView`).

12. **Навігаційні guards.** Це функції, що виконуються до/після переходу й можуть дозволити,
    скасувати чи перенаправити навігацію. У проєкті `router.beforeEach` перевіряє авторизацію, а
    `router.afterEach` змінює заголовок вкладки.

13. **Для чого `meta`?** Це додаткові дані маршруту: `requiresAuth` (потрібен вхід), `guestOnly`,
    `title` (заголовок вкладки), `layout` (який layout використати). Guards та `App.vue` читають
    їх, щоб вирішити, що робити.

14. **Layouts.** У `src/layouts/` лежать `DefaultLayout` (шапка + контент) і `AuthLayout`
    (сторінка логіну по центру). У `App.vue` обирається layout за `route.meta.layout`, а
    `<RouterView />` вставляється у слот layout-а.

15. **Що таке JWT?** Це підписаний токен, який сервер видає після входу. Складається з трьох
    частин через крапку: **header** (алгоритм), **payload** (дані: id користувача, час життя) і
    **signature** (підпис, що захищає від підробки).

16. **Де безпечніше зберігати JWT?** Найбезпечніше — `refreshToken` у `HttpOnly`-cookie (JavaScript
    його не читає), `accessToken` — у пам'яті. `localStorage` доступний будь-якому скрипту на
    сторінці, тому при XSS-атаці токен можна вкрасти. У лабораторній `localStorage` використано,
    бо цього вимагає завдання.

17. **accessToken vs refreshToken.** `accessToken` короткоживучий, його додають до кожного
    захищеного запиту. `refreshToken` живе довше й використовується лише для отримання нового
    `accessToken` (`POST /auth/refresh`), коли старий протух.

18. **Чому пагінація й пошук у query-параметрах?** Адреса `/users?page=2&q=john` можна скопіювати
    чи додати в закладки, вона працює з кнопками «назад/вперед» і зберігається після
    перезавантаження. Локальний стан компонента при цьому втрачається.

19. **Чому після `DELETE` користувач залишається в списку?** DummyJSON лише імітує видалення —
    на сервері нічого не змінюється, тож новий запит знову поверне цього користувача. Виправлення:
    після успішної відповіді самим прибрати його з локального стану (`users.value.filter(...)` у
    `stores/users.ts`) і запам'ятати видалення, щоб він не повертався при зміні сторінки.
