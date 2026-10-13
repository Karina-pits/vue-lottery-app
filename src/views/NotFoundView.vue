<template>
  <section class="card-block text-center">
    <h1 class="page-title">404</h1>
    <p>Сторінку не знайдено. Можливо, адреса введена неправильно.</p>
    <RouterLink class="btn btn-primary" :to="{ name: 'home' }">На головну</RouterLink>
  </section>
</template>
