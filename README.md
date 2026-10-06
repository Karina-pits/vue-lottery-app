# vue-lottery-app

Лабораторна робота №4 — застосунок-лотерея на **Vue 3 + TypeScript + Composition API**
(`<script setup>`), поділений на багаторазові компоненти.

## Технології

- Vue 3 (Composition API, `<script setup lang="ts">`)
- TypeScript
- Vite
- Bootstrap 5 + Bootstrap Icons, підключені через npm, стилізація через SCSS
  (імпортовано лише потрібні партиали: reboot, type, buttons, forms, tables,
  modal, close, transitions, utilities)
- ESLint (`eslint-plugin-vue` + `@typescript-eslint`) + Prettier
- localStorage для персистентності списку учасників

## Запуск

```bash
npm install
npm run dev        # dev-сервер (Vite)
npm run build       # типчек (vue-tsc) + production-збірка у dist/
npm run preview      # перегляд production-збірки
npm run lint           # ESLint
npm run lint:fix        # ESLint з автофіксом
npm run format            # Prettier
```

## Архітектура застосунку

```
src/
├── components/
│   ├── BaseButton.vue            # Компонент кнопки
│   ├── BaseInput.vue              # Компонент поля вводу (з v-model, помилкою, valid-станом)
│   ├── WinnerBadge.vue             # Компонент переможця (бейдж + кнопка видалення)
│   ├── WinnersBlock.vue             # Блок списку переможців + кнопка "New winner"
│   ├── RegisterForm.vue              # Блок форми реєстрації нового учасника
│   ├── SearchBar.vue                  # Поле пошуку (filter-by-name з debounce 300мс)
│   ├── ParticipantsTable.vue           # Блок таблиці з учасниками (сортування, фільтрація, дії)
│   ├── Modal.vue                        # Багаторазове модальне вікно (слоти + CSS-переходи)
│   ├── EditParticipantModal.vue          # Модалка редагування учасника (використовує Modal)
│   └── DeleteConfirmModal.vue             # Модалка підтвердження видалення (використовує Modal)
├── composables/
│   ├── useParticipants.ts    # Стан учасників + localStorage (watch deep)
│   └── useWinners.ts          # Логіка вибору/видалення переможців
├── types/participant.ts        # Participant, ParticipantFormData, SortField, SortDirection
├── utils/validators.ts          # Чисті функції валідації форми (без DOM, без alert)
├── styles/main.scss              # SCSS з точковими імпортами Bootstrap + власні стилі
├── App.vue                        # Кореневий компонент, що зв'язує блоки через props/emits
└── main.ts                         # Точка входу
```

### Потік даних (props / emits)

Весь бізнес-стан (список учасників, переможці) живе в `App.vue` через composables
`useParticipants`/`useWinners`. Дочірні компоненти отримують дані лише через **props**
і повідомляють про дії лише через **emits** — жоден дочірній компонент напряму не
мутує отримані props (`WinnersBlock` не змінює масив `winners`, а лише емітить
`pick-winner`/`remove-winner`; `ParticipantsTable` не змінює `participants`, а емітить
`edit-participant`/`delete-participant`; `RegisterForm`/`EditParticipantModal` емітять
`register`/`update` з новими даними, і саме `App.vue` вирішує, застосовувати їх чи ні
(наприклад, при дублікаті email) — так демонструється односторонній потік даних
Vue (props вниз, events вгору).

### Де саме виконано вимоги практичної частини

- **Composition API + TypeScript** — усі компоненти на `<script setup lang="ts">`,
  усі props/emits типізовані через `defineProps<...>()`/`defineEmits<...>()`.
- **Обчислювані властивості** — `visibleParticipants` у `ParticipantsTable.vue`
  (фільтрація + сортування), `winners`/`canPickWinner`/`editingParticipant`/
  `deletingParticipant` в `App.vue`/`useWinners.ts`.
- **Обробка подій + модифікатори** — `@keyup.enter="handleSubmit"` у `RegisterForm.vue`,
  `@keyup.esc="requestClose"` та `@click.self="requestClose"` у `Modal.vue`.
- **Прив'язування елементів форми** — `v-model` на кастомному компоненті `BaseInput`
  (`modelValue` prop + `update:modelValue` emit), пояснено явним `:value`/`@input`
  усередині `BaseInput.vue`.
- **Props / події компонентів** — наскрізно, див. вище.
- **Watchers** — `watch(participants, …, { deep: true })` для localStorage
  (`useParticipants.ts`), `watch(query, …)` з debounce 300мс у `SearchBar.vue`,
  `watch(() => props.resetTrigger, …)` та `watch(() => props.duplicateEmailError, …)`
  у `RegisterForm.vue`/`EditParticipantModal.vue`.
- **Слоти** — `Modal.vue` має іменовані слоти `header`/`footer` і слот за
  замовчуванням (тіло), що дозволяє переюзати його в `EditParticipantModal.vue`
  і `DeleteConfirmModal.vue` без дублювання логіки backdrop/Esc/переходів.
- **CSS-переходи** — `<Transition name="modal-fade">` у `Modal.vue` (SCSS-класи
  `.modal-fade-*` у `src/styles/main.scss`), анімує і затемнення backdrop, і
  появу/зникнення самого діалогу.
- **Багаторазовий компонент таблиці** — `ParticipantsTable.vue` приймає зовнішні
  дані через props (`participants`) і не залежить від того, звідки вони взялись.

## Відповідність дизайну

- Верхній блок — рядок із бейджами переможців (`WinnersBlock`/`WinnerBadge`) та
  кнопкою «New winner».
- Другий блок — форма реєстрації (`RegisterForm`) з полями Name / Date of Birth /
  Email / Phone number, валідацією під полем (зелена рамка + ✓ при валідному
  значенні, червона рамка + текст помилки при невалідному) — без жодного `alert`.
- Третій блок — таблиця учасників (`ParticipantsTable`) з пошуком (`SearchBar`),
  сортуванням за іменем/датою народження та діями "Редагувати"/"Видалити".

## Контрольні запитання

1. **Обчислювані властивості (computed).** Це властивості, значення яких
   автоматично виводиться з інших реактивних даних і кешується. На відміну
   від звичайного методу (який виконується заново при кожному виклику — тобто
   при кожному рендері шаблону, де він згадується), `computed` перераховується
   лише тоді, коли реально змінилась одна з реактивних залежностей, використаних
   усередині нього; між змінами повторні звернення просто повертають закешоване
   значення. Приклад: `visibleParticipants` у `ParticipantsTable.vue`.

2. **Кешування computed.** Vue під час першого обчислення `computed` відстежує,
   які саме реактивні джерела (`ref`/`reactive`/інші `computed`) були прочитані
   всередині функції-геттера, і підписується на них. Поки жодне з них не
   змінилось, звернення до `.value` повертає збережений результат без повторного
   виконання функції. Як тільки одна з залежностей змінюється, `computed`
   позначається "брудним" і перераховується лише один раз — при наступному
   зверненні до нього (лениво), а не одразу в момент зміни залежності.

3. **Writable computed.** Так, можна — замість функції-геттера передати об'єкт
   `{ get, set }`: `computed({ get: () => …, set: (value) => { … } })`. Виклик
   `set` відбувається при спробі присвоїти `computedRef.value = …` і зазвичай
   усередині оновлює ту реактивну властивість (чи властивості), з якої
   обчислюється `get`.

4. **Способи оголошення обробників подій.** Inline-вираз прямо в шаблоні
   (`@click="count++"`), посилання на метод компонента (`@click="handleClick"`),
   inline-виклик методу з аргументами (`@click="handleClick($event, id)"`).
   Inline-обробник — це JS-вираз, що виконується прямо в контексті шаблону
   (зручно для простих однорядкових дій); обробник-метод — це визначена в
   `<script setup>` функція, яку зручно тестувати окремо й повторно
   використовувати. У проекті: `RegisterForm.vue` використовує метод
   `handleSubmit`, а `WinnerBadge.vue` — inline-вираз `@click="emit('remove',
   winner.id)"`.

5. **Модифікатори подій і ключові модифікатори.** `.prevent` викликає
   `event.preventDefault()`, `.stop` — `event.stopPropagation()`, `.once` —
   прибирає обробник після першого спрацювання. Ключові модифікатори (`.enter`,
   `.esc` тощо) фільтрують подію клавіатури так, щоб обробник спрацьовував лише
   для конкретної клавіші, без ручної перевірки `event.key` усередині
   обробника. У проекті: `RegisterForm.vue` — `@keyup.enter="handleSubmit"`
   (відправка форми по Enter); `Modal.vue` — `@keyup.esc="requestClose"`
   (закриття по Esc) та `@click.self="requestClose"` (закриття лише при кліку
   саме на backdrop, не на дочірні елементи діалогу).

6. **Директива v-model.** Це синтаксичний цукор, що поєднує `:value="x"`
   (односторонню прив'язку значення до поля) та `@input="x = $event.target.value"`
   (оновлення змінної при події `input`) в одну директиву. Для звичайного
   текстового `<input>` ці два записи повністю еквівалентні. Саме цей
   "розгорнутий" варіант явно показано в `BaseInput.vue`: `:value="modelValue"`
   + `@input="onInput"`, де `onInput` робить `emit('update:modelValue', …)`.

7. **v-model з різними елементами форми.** `text`/`textarea` — прив'язує
   `value`; `checkbox` — прив'язує `checked` (булеве значення для одного
   чекбокса, або масив вибраних значень, якщо кілька чекбоксів поділяють один
   `v-model`); `radio` — теж прив'язує `checked`, усі `radio` з одним і тим же
   `v-model` утворюють групу, і пов'язана змінна отримує `value` вибраної
   кнопки; `select` — прив'язує `value` вибраної `<option>` (при зміні вибору
   `v-model` автоматично оновлюється значенням `value` обраної опції).

8. **Модифікатори v-model.** `.lazy` змінює подію синхронізації з `input` на
   `change` (значення оновлюється лише після втрати фокусу / Enter, а не на
   кожне натискання клавіші); `.number` автоматично приводить введений рядок до
   `Number` (зручно для числових полів); `.trim` автоматично обрізає пробіли на
   початку й у кінці введеного рядка.

9. **Валідація форми без alert.** Реалізована через чисті функції у
   `src/utils/validators.ts`, які нічого не знають про DOM чи Vue: окремо
   перевіряється обов'язковість поля (`validateRequired`), формат email
   (`EMAIL_REGEXP`), формат телефону (`PHONE_REGEXP`, `+380XXXXXXXXX`) та дата
   народження (не в майбутньому). `validateParticipantForm` збирає результат у
   звичайний об'єкт помилок `{ name?, dateOfBirth?, email?, phone? }`. Цей
   об'єкт зберігається в `reactive errors` компонента форми й передається в
   `BaseInput` як prop `error`, який рендерить `<p class="form-field__error">`
   під полем — замість виклику `alert`.

10. **Очищення форми без спрацювання валідації.** `resetForm()` у
    `RegisterForm.vue` скидає `values` до порожніх рядків і одночасно повністю
    очищує і `errors`, і `touched` (замість того, щоб викликати
    `runValidation()`). Оскільки `BaseInput` показує помилку лише коли
    `touched[field] === true` (`:error="touched.name ? errors.name :
    undefined"`), а `touched` теж скинуто в `false`, порожні поля після
    очищення не підсвічуються як невалідні.

11. **Props.** Це дані (будь-якого типу — рядки, числа, об'єкти, функції,
    масиви), які батьківський компонент явно передає дочірньому через атрибути
    в шаблоні. Напрямок передачі — завжди односторонній, **"згори вниз"**
    (parent → child): дочірній компонент лише читає props, а не задає їх сам.

12. **Чому не можна мутувати props напряму.** Тому що це порушило б
    односторонній потік даних Vue: значення props належить батькові, і якщо
    батько передасть нове значення (наприклад, після власного ререндеру),
    будь-яка локальна мутація всередині дочірнього компонента буде миттєво
    перезаписана/загублена, а стан стане неузгодженим між компонентами; Vue в
    dev-режимі навіть виводить попередження при спробі такої мутації.
    Правильний спосіб — дочірній компонент надсилає **подію** (`emit`) з новим
    бажаним значенням, а батько сам вирішує, оновлювати свій стан чи ні (саме
    так `Modal.vue` не ховає себе сам, а просить про це батька через
    `emit('close')`, і лише після цього `v-if` у `App.vue` прибирає модалку з
    DOM).

13. **Типізація props через TypeScript.** У `<script setup lang="ts">` —
    через generic-виклик `defineProps<{ name: string; age?: number }>()`: сам
    TS-тип уже визначає обов'язковість (поле без `?` — обов'язкове) та
    необов'язковість (`?`). Значення за замовчуванням для необов'язкових полів
    задаються через `withDefaults(defineProps<…>(), { age: 18 })`. Приклад:
    `BaseButton.vue` — `withDefaults(defineProps<{ variant?: …; disabled?:
    boolean }>(), { variant: 'primary', disabled: false })`.

14. **emit і подія дочірнього компонента.** `emit` — спосіб дочірнього
    компонента "достукатися" до батьківського й повідомити про подію разом з
    даними. Типізується через `defineEmits<{ eventName: [payload: Type]
    }>()`, після чого викликається як `emit('eventName', payload)`. Батько
    підписується на подію в шаблоні через `@event-name="handler"`. Приклад:
    `WinnerBadge.vue` — `defineEmits<{ remove: [id: string] }>()`, у шаблоні
    `App.vue`/`WinnersBlock.vue` — `@remove-winner="removeWinner"`.

15. **Двостороннє зв'язування (v-model) на власному компоненті.** Компонент
    приймає prop `modelValue` і визначає подію `update:modelValue`; коли
    батько пише `<MyInput v-model="x" />`, Vue автоматично розгортає це в
    `:model-value="x" @update:model-value="x = $event"`. Саме так реалізовано
    `BaseInput.vue` (`modelValue` prop + `emit('update:modelValue', …)`), тому
    `RegisterForm.vue` може писати просто `v-model="values.name"`.

16. **Слоти.** Механізм, що дозволяє батьківському компоненту вставити
    довільний вміст (розмітку, інші компоненти) усередину заздалегідь
    визначеного "місця" в шаблоні дочірнього компонента. Слот за замовчуванням
    (`<slot />` без імені) приймає весь вміст, переданий без явного
    `v-slot:ім'я`; іменовані слоти (`<slot name="header">…</slot>`) дають
    змогу визначити кілька незалежних місць вставки в різних частинах
    шаблону. У `Modal.vue` є три слоти — `header`, тіло (default) і `footer` —
    завдяки чому один і той самий компонент `Modal` переюзається і в
    `EditParticipantModal.vue` (форма редагування в тілі, кнопки "Скасувати"/
    "Оновити дані" у footer), і в `DeleteConfirmModal.vue` (текст підтвердження
    в тілі, кнопки "Так"/"Ні" у footer) — без дублювання коду backdrop,
    Esc-обробника чи CSS-переходу.

17. **Watchers.** `watch` відстежує зміну конкретного реактивного джерела
    (`ref`, `reactive`-властивість, або getter-функцію) і виконує побічний
    ефект (side effect) у відповідь на зміну — на відміну від `computed`, він
    нічого не повертає і не кешується, а просто реагує. `computed` варто
    використовувати, коли потрібне похідне значення для відображення
    (синхронний чистий розрахунок без побічних ефектів); `watch` — коли
    потрібна саме дія у відповідь на зміну (запис у `localStorage`, виклик
    API, `emit` події, debounce пошуку). У проекті `computed` —
    `visibleParticipants`/`winners`; `watch` — збереження в `localStorage`
    (`useParticipants.ts`), debounce пошуку (`SearchBar.vue`), реакція на
    `resetTrigger`/`duplicateEmailError` (`RegisterForm.vue`,
    `EditParticipantModal.vue`).

18. **Опції deep та immediate; watchEffect.** `deep: true` змушує `watch`
    відстежувати й вкладені зміни всередині об'єкта чи масиву (а не лише
    заміну самого посилання) — без цієї опції `watch` на масив `participants`
    не відреагував би на `push()` чи зміну поля одного з учасників, лише на
    повну заміну всього масиву новим. `immediate: true` запускає callback
    одразу при створенні watcher'а (з поточним значенням), а не тільки після
    першої зміни. `watchEffect` автоматично відстежує всі реактивні
    залежності, використані всередині переданої функції (без явного
    перерахування джерел), і виконується одразу при створенні (поведінка
    нагадує `watch` з `immediate: true`), але без доступу до старого значення
    (`oldValue`) і без можливості явно вказати, за чим саме стежити.

19. **localStorage через watcher.** Саме так реалізовано в
    `useParticipants.ts`: при створенні composable (тобто під час
    завантаження застосунку) `participants` одразу ініціалізується
    результатом `loadParticipantsFromStorage()` — читанням і `JSON.parse`
    значення з `localStorage`. Окремо `watch(participants, (value) => {
    localStorage.setItem(KEY, JSON.stringify(value)) }, { deep: true })`
    зберігає актуальний стан масиву в `localStorage` щоразу, коли змінюється
    сам масив або будь-яка властивість будь-якого учасника всередині нього.

20. **Принципи поділу на компоненти.** Єдина відповідальність (кожен
    компонент відповідає рівно за одну річ — `BaseButton` лише кнопка,
    `SearchBar` лише пошук), повторне використання (однотипні елементи UI —
    `BaseButton`, `BaseInput`, `Modal` — винесені окремо й використовуються в
    кількох місцях без дублювання), ізоляція стану (суто UI-стан на кшталт
    `touched`/`searchQuery` живе всередині відповідного компонента, а спільний
    бізнес-стан — в `App.vue`/composables), чіткий контракт `props`/`emits` між
    батьком і дитиною. **Багаторазовий (reusable) компонент** — це компонент,
    не прив'язаний жорстко до конкретних даних чи контексту використання: усе
    потрібне він отримує через `props`, а про події повідомляє через `emits`,
    тому його можна вставити в будь-яке інше місце застосунку без зміни коду
    самого компонента (приклад — `BaseButton`/`BaseInput`/`Modal` однаково
    працюють і в `RegisterForm`, і в `EditParticipantModal`, і в
    `DeleteConfirmModal`).

21. **Сортування та фільтрація через computed.** У `ParticipantsTable.vue`
    обчислювана властивість `visibleParticipants` спочатку фільтрує
    `props.participants` за `searchQuery` (входження підрядка в ім'я, без
    урахування регістру завдяки `.toLowerCase()`), а потім сортує відфільтрований
    масив за полем `sortField` (`name` або `dateOfBirth`) у напрямку
    `sortDirection` (`localeCompare` для імені, порівняння рядків `yyyy-mm-dd`
    для дати — таке порівняння еквівалентне хронологічному). Оскільки це
    `computed`, результат автоматично перераховується щоразу, коли змінюється
    будь-яка з його залежностей (`props.participants`, `searchQuery`,
    `sortField`, `sortDirection`) — без потреби вручну викликати
    фільтрацію/сортування в обробниках подій.

22. **Options API vs Composition API.** Options API організовує компонент
    через фіксований набір опцій одного об'єкта (`data()`, `methods: {}`,
    `computed: {}`, `watch: {}` тощо) — логіка однієї функціональної частини
    виявляється розкиданою по різних секціях файлу. Composition API (функція
    `setup()` або, як у цьому проекті, `<script setup>`) дозволяє групувати
    весь пов'язаний код (стан + методи + `computed` + `watch` для однієї
    функціональності) **в одному місці**, легко виносити повторно
    використовувану логіку в окремі composables (як `useParticipants.ts`/
    `useWinners.ts` у цьому проекті) і значно краще працює з виведенням типів
    TypeScript. Options API простіший для початківців і для зовсім невеликих
    компонентів із чіткою структурою "по шухлядках"; Composition API виграє в
    більших застосунках із великою кількістю пов'язаної логіки, яку хочеться
    перевикористовувати між компонентами.
