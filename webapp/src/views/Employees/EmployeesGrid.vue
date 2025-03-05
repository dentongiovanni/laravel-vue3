<script setup lang="ts">
import { computed, ref, defineProps } from 'vue'
import type { Employee } from '@/types/Employee'

const searchQuery = ref('')

const props = defineProps<{
  employees: Employee[]
}>()

const filteredEmployees = computed(() => {
  if (!searchQuery.value) {
    return props.employees
  }
  const query = searchQuery.value.toLowerCase()

  return props.employees.filter(emp => {

    const firstNameMatch = emp.first_name.toLowerCase().includes(query)
    const lastNameMatch = emp.last_name?.toLowerCase().includes(query)
    return firstNameMatch || lastNameMatch
  })
})

const emits = defineEmits<{
  (e: 'editEmployee', id: number | string): void
  (e: 'deleteEmployee', id: number | string): void
}>()

const handleEdit = (id: number | string) => {
  emits('editEmployee', id)
}

const handleDelete = (id: number | string) => {
  emits('deleteEmployee', id)
}
</script>

<template>

  <div class="mb-4">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search employees..."
      class="border rounded px-2 py-1 w-full"
    />
  </div>

  <!-- Employee Cards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="employee in filteredEmployees"
      :key="employee.id"
      class="bg-white border border-gray-200 rounded-lg shadow p-5 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="flex items-center space-x-4">
        <!-- If your API provides 'thumbnail_url', use it. Otherwise fallback to 'thumbnail' -->
        <img :src="employee.thumbnail_url || '/images/default_avatar.png'"
          alt="Employee Thumbnail"
          class="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h4 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ employee.first_name }} {{ employee.last_name }}
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ employee.department?.name || 'No department' }}
          </p>
        </div>
      </div>

      <div class="mt-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Hire Date:
          <span class="font-medium">
            {{ employee.hire_date || 'N/A' }}
          </span>
        </p>
      </div>

      <div class="mt-4 flex space-x-2">
        <button
          @click="handleEdit(employee.id)"
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-2 rounded text-sm"
        >
          Edit
        </button>
        <button
          @click="handleDelete(employee.id)"
          class="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
