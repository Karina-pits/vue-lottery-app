<script setup lang="ts">
import { PROJECT } from '@/constants/author';

const technologies = [
  'Vue 3 (Composition API, <script setup>) + TypeScript',
  'Vue Router — маршрутизація, guards, вкладені маршрути, layouts',
  'Pinia — стан застосунку (auth, users, winners)',
  'Патерн Repository + HTTP-клієнт (fetch) з interceptor для оновлення JWT',
  'VeeValidate + yup — валідація форм',
  'Bootstrap 5 (SCSS, лише потрібні партиали) + Bootstrap Icons',
  'Vite, ESLint, Prettier',
  'DummyJSON — тестовий REST API (Users, Auth)',
];
</script>

<template>
  <section class="card-block">
    <h1 class="page-title">{{ PROJECT.name }}</h1>
    <p>
      Навчальний застосунок-лотерея. Користувачі беруться з публічного REST API DummyJSON: їх можна
      переглядати, шукати, створювати, редагувати та видаляти, а також випадково обирати до трьох
      переможців. Доступ до розділу Users мають лише авторизовані користувачі (JWT).
    </p>

    <h2 class="section-title">Технології</h2>
    <ul>
      <li v-for="technology in technologies" :key="technology">{{ technology }}</li>
    </ul>

    <h2 class="section-title">Код проєкту</h2>
    <p>
      <a :href="PROJECT.githubUrl" target="_blank" rel="noopener noreferrer">
        <i class="bi bi-github"></i> {{ PROJECT.githubUrl }}
      </a>
    </p>
  </section>
</template>
