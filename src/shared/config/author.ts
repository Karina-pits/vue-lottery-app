/**
 * Дані про автора та проєкт для сторінок Home та About.
 */
export const AUTHOR = {
  fullName: 'Піць Каріна Ярославівна',
  githubUrl: 'https://github.com/Karina-pits',
  skills: [
    { group: 'Мови', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS'] },
    { group: 'Frontend', items: ['Vue 3 (Composition API)', 'Vue Router', 'Pinia', 'PrimeVue'] },
    { group: 'Архітектура', items: ['Feature-Sliced Design', 'Патерн Repository'] },
    { group: 'Інструменти', items: ['Vite', 'ESLint', 'Prettier', 'Git / GitHub'] },
    { group: 'Інше', items: ['REST API', 'JWT-авторизація', 'VeeValidate + yup'] },
  ],
} as const;

export const PROJECT = {
  name: 'Vue Lottery App',
  githubUrl: 'https://github.com/Karina-pits/vue-lottery-app',
} as const;

export const APP_TITLE = PROJECT.name;
