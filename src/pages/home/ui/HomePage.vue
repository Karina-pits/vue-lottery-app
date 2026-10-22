<script setup lang="ts">
import { PROJECT } from '@/shared/config';

const technologies = [
  'Vue 3 (Composition API, <script setup>) + TypeScript',
  'Feature-Sliced Design: шари app / pages / widgets / features / entities / shared',
  'Vue Router — маршрутизація, guards, вкладені маршрути, layouts',
  'Pinia (setup stores) — стан застосунку: session, users, settings',
  'Патерн Repository + HTTP-клієнт (fetch) з interceptor для оновлення JWT',
  'PrimeVue (обгортки в shared/ui) + SCSS, світла/темна тема',
  'VeeValidate + yup — валідація форм',
  'ESLint + eslint-plugin-boundaries — перевірка правил FSD',
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
        <i class="pi pi-github"></i> {{ PROJECT.githubUrl }}
      </a>
    </p>
  </section>
</template>
