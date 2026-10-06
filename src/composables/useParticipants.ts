import { ref, watch, type Ref } from 'vue';
import type { Participant, ParticipantFormData } from '../types/participant';

const STORAGE_KEY = 'vue-lottery-participants';

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadParticipantsFromStorage(): Participant[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as Participant[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sameEmail(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export interface UseParticipantsReturn {
  participants: Ref<Participant[]>;
  /** true, якщо учасник з таким email уже існує (без урахування регістру). `excludeId` — власний id при редагуванні. */
  isEmailTaken: (email: string, excludeId?: string) => boolean;
  addParticipant: (data: ParticipantFormData) => Participant;
  updateParticipant: (id: string, data: ParticipantFormData) => void;
  removeParticipant: (id: string) => void;
  findParticipant: (id: string) => Participant | undefined;
}

/**
 * Інкапсулює стан списку учасників лотереї та його персистентність
 * у localStorage: відновлення відбувається одразу при створенні
 * composable (тобто при завантаженні застосунку), а збереження —
 * через `watch` зі `deep: true` на кожну зміну масиву.
 */
export function useParticipants(): UseParticipantsReturn {
  const participants = ref<Participant[]>(loadParticipantsFromStorage());

  watch(
    participants,
    (value) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    },
    { deep: true },
  );

  function isEmailTaken(email: string, excludeId?: string): boolean {
    return participants.value.some(
      (p) => p.id !== excludeId && sameEmail(p.email, email),
    );
  }

  function addParticipant(data: ParticipantFormData): Participant {
    const participant: Participant = { id: generateId(), ...data };
    participants.value.push(participant);
    return participant;
  }

  function updateParticipant(id: string, data: ParticipantFormData): void {
    const index = participants.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      participants.value[index] = { id, ...data };
    }
  }

  function removeParticipant(id: string): void {
    participants.value = participants.value.filter((p) => p.id !== id);
  }

  function findParticipant(id: string): Participant | undefined {
    return participants.value.find((p) => p.id === id);
  }

  return {
    participants,
    isEmailTaken,
    addParticipant,
    updateParticipant,
    removeParticipant,
    findParticipant,
  };
}
