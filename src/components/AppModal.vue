<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' }
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-brand-950/45 backdrop-blur-sm" @click="emit('close')" />

        <div
          class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-2xl shadow-brand-950/20"
        >
          <div class="flex items-center justify-between border-b border-brand-100 px-6 py-4">
            <h2 class="font-serif text-lg font-semibold text-brand-900">{{ title }}</h2>
            <button
              type="button"
              class="rounded-lg p-1.5 text-brand-400 transition-colors hover:bg-brand-50 hover:text-brand-700"
              aria-label="Close dialog"
              @click="emit('close')"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="overflow-y-auto p-6">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
