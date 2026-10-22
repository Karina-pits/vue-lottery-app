import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { User } from '@/entities/user/model/types';

export const MAX_WINNERS = 3;

export const useWinnersStore = defineStore('winners', () => {
  const winners = ref<User[]>([]);

  function canPickWinner(candidates: User[]): boolean {
    return (
      winners.value.length < MAX_WINNERS &&
      candidates.some((c) => !winners.value.some((w) => w.id === c.id))
    );
  }

  function pickRandomWinner(candidates: User[]): void {
    if (!canPickWinner(candidates)) {
      return;
    }
    const eligible = candidates.filter((c) => !winners.value.some((w) => w.id === c.id));
    winners.value.push(eligible[Math.floor(Math.random() * eligible.length)]);
  }

  function removeWinner(id: number): void {
    winners.value = winners.value.filter((w) => w.id !== id);
  }

  return { winners, canPickWinner, pickRandomWinner, removeWinner };
});
