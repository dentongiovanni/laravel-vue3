<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDepartmentStore } from '@/stores/departmentStore'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)


const departmentStore = useDepartmentStore()

const currentPageTitle = ref('Edit Department')

const name = ref('')
const description = ref('')
const nameError = ref('')


function loadDepartment() {
  const departmentId = route.params.id
  const department = departmentStore.departments.find(
    (d) => String(d.id) === String(departmentId)
  )

  if (department) {
    name.value = department.name
    description.value = department.description ?? ''
  } else {
    router.push({ name: 'DepartmentList' })
  }
}

onMounted(() => {
  loadDepartment()
})

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

  departmentStore.updateDepartment({
    id: route.params.id,
    name: name.value,
    description: description.value,
  })
  .then(() => {

    departmentStore.successMessage = 'Department updated successfully!'
    router.push({ name: 'DepartmentList' })
  })
  .catch((error) => {
    console.error('Error updating department:', error)
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

    <!-- Main content container -->
    <div class="bg-white p-6 rounded-md shadow">
      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10"
      >
        <div class="text-white font-semibold">
          Processing...
        </div>
      </div>

      <h2 class="text-xl font-semibold mb-4">Edit Department</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Department Name -->
        <div class="mb-4">
          <label for="department-name" class="block text-sm font-medium text-gray-700 mb-1">
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
          <label for="department-description" class="block text-sm font-medium text-gray-700 mb-1">
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
          Update
        </button>
      </form>
    </div>
  </admin-layout>
</template>
