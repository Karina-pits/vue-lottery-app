<script setup lang="ts">
import { computed, ref } from 'vue';
import WinnersBlock from './components/WinnersBlock.vue';
import RegisterForm from './components/RegisterForm.vue';
import ParticipantsTable from './components/ParticipantsTable.vue';
import EditParticipantModal from './components/EditParticipantModal.vue';
import DeleteConfirmModal from './components/DeleteConfirmModal.vue';
import { useParticipants } from './composables/useParticipants';
import { useWinners } from './composables/useWinners';
import type { ParticipantFormData } from './types/participant';

const { participants, isEmailTaken, addParticipant, updateParticipant, removeParticipant, findParticipant } =
  useParticipants();
const { winnerIds, canPickWinner, pickRandomWinner, removeWinner, dropParticipant } =
  useWinners(participants);

const winners = computed(() =>
  winnerIds.value
    .map((id) => findParticipant(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p)),
);

// --- Реєстрація нового учасника ---

const registerResetTrigger = ref(0);
const registerDuplicateEmailError = ref<string | null>(null);

function handleRegister(data: ParticipantFormData): void {
  if (isEmailTaken(data.email)) {
    registerDuplicateEmailError.value = 'Учасник з такою електронною поштою вже зареєстрований.';
    return;
  }
  registerDuplicateEmailError.value = null;
  addParticipant(data);
  registerResetTrigger.value += 1;
}

// --- Редагування учасника ---

const editingParticipantId = ref<string | null>(null);
const editDuplicateEmailError = ref<string | null>(null);
const editingParticipant = computed(() =>
  editingParticipantId.value ? findParticipant(editingParticipantId.value) : undefined,
);

function openEditModal(id: string): void {
  editDuplicateEmailError.value = null;
  editingParticipantId.value = id;
}

function closeEditModal(): void {
  editingParticipantId.value = null;
}

function handleUpdateParticipant(id: string, data: ParticipantFormData): void {
  if (isEmailTaken(data.email, id)) {
    editDuplicateEmailError.value = 'Учасник з такою електронною поштою вже зареєстрований.';
    return;
  }
  editDuplicateEmailError.value = null;
  updateParticipant(id, data);
  closeEditModal();
}

// --- Видалення учасника ---

const deletingParticipantId = ref<string | null>(null);
const deletingParticipant = computed(() =>
  deletingParticipantId.value ? findParticipant(deletingParticipantId.value) : undefined,
);

function openDeleteModal(id: string): void {
  deletingParticipantId.value = id;
}

function closeDeleteModal(): void {
  deletingParticipantId.value = null;
}

function confirmDelete(id: string): void {
  removeParticipant(id);
  dropParticipant(id); // якщо учасник був переможцем — прибираємо і з блоку переможців
  closeDeleteModal();
}

// --- Переможці ---

function handlePickWinner(): void {
  pickRandomWinner(participants.value);
}
</script>

<template>
  <div class="app">
    <WinnersBlock
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick-winner="handlePickWinner"
      @remove-winner="removeWinner"
    />

    <RegisterForm
      :duplicate-email-error="registerDuplicateEmailError"
      :reset-trigger="registerResetTrigger"
      @register="handleRegister"
    />

    <ParticipantsTable
      :participants="participants"
      @edit-participant="openEditModal"
      @delete-participant="openDeleteModal"
    />

    <EditParticipantModal
      v-if="editingParticipant"
      :participant="editingParticipant"
      :duplicate-email-error="editDuplicateEmailError"
      @update="handleUpdateParticipant"
      @close="closeEditModal"
    />

    <DeleteConfirmModal
      v-if="deletingParticipant"
      :participant="deletingParticipant"
      @confirm="confirmDelete"
      @close="closeDeleteModal"
    />
  </div>
</template>
