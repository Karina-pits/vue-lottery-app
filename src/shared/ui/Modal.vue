<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

/**
 * Багаторазовий компонент модального вікна з настроюваними слотами
 * (header, default — тіло, footer) та переходом появи/зникнення через
 * Vue <Transition> (CSS transitions). Закривається по кліку на backdrop
 * або по Esc (ключовий модифікатор keyup.esc) — закриття спочатку
 * програє leave-анімацію і лише потім повідомляє батьківський компонент
 * подією close, щоб той міг прибрати модалку з DOM (v-if).
 */
defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(false);
const backdropRef = ref<HTMLDivElement | null>(null);

function requestClose(): void {
  visible.value = false;
}

function onAfterLeave(): void {
  emit('close');
}

onMounted(async () => {
  visible.value = true;
  await nextTick();
  backdropRef.value?.focus();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade" @after-leave="onAfterLeave">
      <div
        v-if="visible"
        ref="backdropRef"
        class="modal-backdrop-custom"
        tabindex="-1"
        @click.self="requestClose"
        @keyup.esc="requestClose"
      >
        <div class="modal-dialog-custom" role="dialog" aria-modal="true">
          <div class="modal-dialog-custom__header">
            <h2 class="modal-dialog-custom__title">
              <slot name="header">{{ title }}</slot>
            </h2>
            <button
              type="button"
              class="btn-close"
              aria-label="Закрити"
              @click="requestClose"
            ></button>
          </div>
          <div class="modal-dialog-custom__body">
            <slot />
          </div>
          <div class="modal-dialog-custom__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
