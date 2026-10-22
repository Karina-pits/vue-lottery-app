<script setup lang="ts">
import { AUTHOR } from '@/shared/config';
</script>

<template>
  <section class="card-block">
    <h1 class="page-title">About author</h1>
    <p><strong>ПІБ:</strong> {{ AUTHOR.fullName }}</p>
    <p>
      <strong>GitHub:</strong>
      <a :href="AUTHOR.githubUrl" target="_blank" rel="noopener noreferrer">
        {{ AUTHOR.githubUrl }}
      </a>
    </p>

    <h2 class="section-title">Technical skills</h2>
    <p v-for="skill in AUTHOR.skills" :key="skill.group">
      <strong>{{ skill.group }}:</strong> {{ skill.items.join(', ') }}
    </p>
  </section>
</template>
