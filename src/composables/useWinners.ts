import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { Participant } from '../types/participant';

const MAX_WINNERS = 3;

export interface UseWinnersReturn {
  winnerIds: Ref<string[]>;
  canPickWinner: ComputedRef<boolean>;
  pickRandomWinner: (participants: Participant[]) => void;
  removeWinner: (id: string) => void;
  /** Прибирає учасника зі списку переможців (викликається при видаленні учасника). */
  dropParticipant: (id: string) => void;
}

/**
 * Керує списком id переможців (не більше `MAX_WINNERS`, кожен учасник —
 * переможець не більше одного разу).
 */
export function useWinners(participants: Ref<Participant[]>): UseWinnersReturn {
  const winnerIds = ref<string[]>([]);

  const canPickWinner = computed(() => {
    if (winnerIds.value.length >= MAX_WINNERS) {
      return false;
    }
    return participants.value.some((p) => !winnerIds.value.includes(p.id));
  });

  function pickRandomWinner(allParticipants: Participant[]): void {
    if (!canPickWinner.value) {
      return;
    }
    const eligible = allParticipants.filter((p) => !winnerIds.value.includes(p.id));
    if (eligible.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * eligible.length);
    winnerIds.value.push(eligible[randomIndex].id);
  }

  function removeWinner(id: string): void {
    winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id);
  }

  function dropParticipant(id: string): void {
    removeWinner(id);
  }

  return { winnerIds, canPickWinner, pickRandomWinner, removeWinner, dropParticipant };
}
