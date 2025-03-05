<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  employeeId: number | string | null
}>()

const emits = defineEmits<{
  (e: 'confirmDelete'): void
  (e: 'cancelDelete'): void
}>()

const isDeleting = ref(false)

function handleConfirm() {
  isDeleting.value = true
  emits('confirmDelete')
}

function handleCancel() {
  emits('cancelDelete')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white w-full max-w-md p-6 rounded shadow-md">
      <h2 class="text-lg font-semibold mb-4">Confirm Deletion</h2>
      <p class="mb-4">
        Are you sure you want to delete employee
        <strong v-if="employeeId">#{{ employeeId }}</strong>?
      </p>
      <div class="flex justify-end" v-if="!isDeleting">
        <button
          @click="handleCancel"
          class="mr-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          :disabled="isDeleting"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          :disabled="isDeleting"
        >
          Delete
        </button>
      </div>
      <div class="flex justify-end" v-else>
        <span>Deleting...</span>
      </div>
    </div>
  </div>
</template>
