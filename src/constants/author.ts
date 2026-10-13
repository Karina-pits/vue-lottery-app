/**
 * Дані про автора та проєкт для сторінок Home та About.
 * ЗАПОВНІТЬ СВОЇ ДАНІ: ПІБ, GitHub-акаунт та посилання на репозиторій.
 */
export const AUTHOR = {
  fullName: 'Прізвище Каріна По батькові',
  githubUrl: 'https://github.com/your-username',
  skills: [
    { group: 'Мови', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS'] },
    { group: 'Frontend', items: ['Vue 3 (Composition API)', 'Vue Router', 'Pinia', 'Bootstrap'] },
    { group: 'Інструменти', items: ['Vite', 'webpack', 'ESLint', 'Prettier', 'Git / GitHub'] },
    { group: 'Інше', items: ['REST API', 'JWT-авторизація', 'Патерн Repository', 'Mocha / Chai'] },
  ],
} as const;

export const PROJECT = {
  name: 'Vue Lottery App',
  githubUrl: 'https://github.com/your-username/vue-lottery-app',
} as const;
