<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useDepartmentStore } from '@/stores/departmentStore'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const currentPageTitle = ref('Add Department')

const router = useRouter()

const departmentStore = useDepartmentStore()

const name = ref('')
const description = ref('')
const nameError = ref('')

const isLoading = ref(false)

watch(name, (newVal) => {
  if (newVal.trim() !== '') {
    nameError.value = ''
  }
})


function handleSubmit() {

  nameError.value = ''

  if (!name.value.trim()) {
    nameError.value = 'Please enter a department name.'
    return
  }

  isLoading.value = true

  departmentStore.addDepartments({
    name: name.value,
    description: description.value,
  })
  .then(() => {
    name.value = ''
    description.value = ''
    departmentStore.successMessage = 'Department added successfully!'
    router.push('/departments')
  })
  .catch((error) => {
    console.error('Error adding department:', error)
  })
  .finally(() => {
    isLoading.value = false
  })
}
</script>

<template>
  <admin-layout>
    <!-- Breadcrumb -->
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Header with Back button -->
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90"></h3>
      <router-link :to="{ name: 'DepartmentList' }">
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Back
        </button>
      </router-link>
    </div>

    <!-- Main container -->
    <div class="bg-white p-6 rounded-md shadow">
      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-center"
      >
        <div class="text-white font-semibold">Processing...</div>
        <!-- You could replace this text with a spinner icon -->
      </div>

      <h2 class="text-xl font-semibold mb-4">Add New Department</h2>

      <!-- Department Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Department Name -->
        <div class="mb-4">
          <label
            for="department-name"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Department Name
          </label>
          <input
            id="department-name"
            type="text"
            v-model="name"
            :class="[
              'w-full rounded px-3 py-2',
              nameError ? 'border border-red-500' : 'border border-gray-300'
            ]"
            placeholder="Enter department name"
            :disabled="isLoading"
          />
          <!-- Inline error message -->
          <div v-if="nameError" class="text-red-500 text-sm mt-1">
            {{ nameError }}
          </div>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label
            for="department-description"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="department-description"
            v-model="description"
            class="w-full border border-gray-300 rounded px-3 py-2"
            rows="3"
            placeholder="Enter department description"
            :disabled="isLoading"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          :disabled="isLoading"
        >
          Save
        </button>
      </form>
    </div>
  </admin-layout>
</template>
