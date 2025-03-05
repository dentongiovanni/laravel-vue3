<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Department } from '@/types/Department'


const props = defineProps<{
  departments: Department[]
}>()
const emits = defineEmits<{
  (e: 'editDepartment', id: number | string): void
  (e: 'deleteDepartment', id: number | string): void
}>()

const searchQuery = ref('')

const filteredDepartments = computed(() => {
  if (!searchQuery.value) {
    return props.departments
  }
  const query = searchQuery.value.toLowerCase()
  return props.departments.filter(dept => {
    const nameMatch = dept.name.toLowerCase().includes(query)
    const descMatch = dept.description?.toLowerCase().includes(query)
    return nameMatch || descMatch
  })
})

function handleEdit(id: number | string) {
  emits('editDepartment', id)
}

function handleDelete(id: number | string) {
  emits('deleteDepartment', id)
}
</script>

<template>
  <!-- Search Bar -->
  <div class="mb-4">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search departments..."
      class="border rounded px-2 py-1 w-full"
    />
  </div>

  <!-- Departments Table -->
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          ID
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Name
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Description
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Actions
        </th>
      </tr>
    </thead>

    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="dept in filteredDepartments" :key="dept.id">
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {{ dept.id }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {{ dept.name }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {{ dept.description || 'No description' }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
          <button
            @click="handleEdit(dept.id)"
            class="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-2 rounded text-sm mr-2"
          >
            Edit
          </button>
          <button
            @click="handleDelete(dept.id)"
            class="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
