<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useEmployeeStore } from '@/stores/employeesStore'
import { useDepartmentStore } from '@/stores/departmentStore's


const firstName = ref('')
const lastName = ref('')
const email = ref('')
const selectedDepartmentId = ref<number | string>('')
const hireDate = ref('')
const status = ref('')
const thumbnailFile = ref<File | null>(null)

const firstNameError = ref('')
const lastNameError = ref('')
const emailError = ref('')
const departmentError = ref('')
const statusError = ref('')

const serverErrors = ref<any>({})

const isLoading = ref(false)

const router = useRouter()
const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()
const departments = computed(() => departmentStore.departments)

onMounted(() => {
  departmentStore.fetchDepartments()
})


const getServerError = (field: string): string => 
  serverErrors.value?.errors?.[field]?.[0] || ''

const handleFileChange = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files
  thumbnailFile.value = fileList && fileList.length > 0 ? fileList[0] : null
}

const validateForm = (): boolean => {

  firstNameError.value = ''
  lastNameError.value = ''
  emailError.value = ''
  departmentError.value = ''
  statusError.value = ''
  serverErrors.value = {} 

  let valid = true

  if (!firstName.value.trim()) {
    firstNameError.value = 'Please enter a first name.'
    valid = false
  }
  if (!lastName.value.trim()) {
    lastNameError.value = 'Please enter a last name.'
    valid = false
  }
  if (!email.value.trim()) {
    emailError.value = 'Please enter an email.'
    valid = false
  }
  if (!selectedDepartmentId.value) {
    departmentError.value = 'Please select a department.'
    valid = false
  }
  if (!status.value.trim()) {
    statusError.value = 'Please enter a status.'
    valid = false
  }
  return true
}

const handleSubmit = () => {
  if (!validateForm()) return

  isLoading.value = true
  const formData = new FormData()
  formData.append('first_name', firstName.value)
  formData.append('last_name', lastName.value)
  formData.append('email', email.value)
  formData.append('department_id', String(selectedDepartmentId.value))
  formData.append('hire_date', hireDate.value || '')
  formData.append('status', status.value)

  if (thumbnailFile.value) {
    formData.append('thumbnail', thumbnailFile.value)
  }

  employeeStore.addEmployee(formData)
    .then(() => {
      employeeStore.successMessage = 'Department added successfully!'
      router.push({ name: 'EmployeeList' })
    })
    .catch((error: any) => {
      if (error.response?.status === 422) {
        serverErrors.value = error.response.data
      } else {
        console.error('Error adding employee:', error)
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <admin-layout>
    <!-- Breadcrumb -->
    <PageBreadcrumb pageTitle="Add Employee" />

    <!-- Main container -->
    <div class="bg-white p-6 rounded-md shadow">
      <!-- Loading overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10"
      >
        <div class="text-white font-semibold">Processing...</div>
      </div>

      <h2 class="text-xl font-semibold mb-4">Add New Employee</h2>
      <form @submit.prevent="handleSubmit">
        <!-- First Name -->
        <div class="mb-4">
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            v-model="firstName"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': firstNameError || getServerError('first_name')}"
            :disabled="isLoading"
          />
          <!-- Local error -->
          <div v-if="firstNameError" class="text-red-500 text-sm mt-1">
            {{ firstNameError }}
          </div>
          <!-- Server error -->
          <div v-if="getServerError('first_name')" class="text-red-500 text-sm mt-1">
            {{ getServerError('first_name') }}
          </div>
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            v-model="lastName"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': lastNameError || getServerError('last_name')}"
            :disabled="isLoading"
          />
          <div v-if="lastNameError" class="text-red-500 text-sm mt-1">
            {{ lastNameError }}
          </div>
          <div v-if="getServerError('last_name')" class="text-red-500 text-sm mt-1">
            {{ getServerError('last_name') }}
          </div>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            v-model="email"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': emailError || getServerError('email')}"
            :disabled="isLoading"
          />
          <div v-if="emailError" class="text-red-500 text-sm mt-1">
            {{ emailError }}
          </div>
          <div v-if="getServerError('email')" class="text-red-500 text-sm mt-1">
            {{ getServerError('email') }}
          </div>
        </div>

        <!-- Department -->
        <div class="mb-4">
          <label for="department" class="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department"
            v-model="selectedDepartmentId"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': departmentError || getServerError('department_id')}"
            :disabled="isLoading"
          >
            <option value="">-- Select Department --</option>
            <option
              v-for="dept in departments"
              :key="dept.id"
              :value="dept.id"
            >
              {{ dept.name }}
            </option>
          </select>
          <div v-if="departmentError" class="text-red-500 text-sm mt-1">
            {{ departmentError }}
          </div>
          <div v-if="getServerError('department_id')" class="text-red-500 text-sm mt-1">
            {{ getServerError('department_id') }}
          </div>
        </div>

        <!-- Hire Date -->
        <div class="mb-4">
          <label for="hireDate" class="block text-sm font-medium text-gray-700 mb-1">
            Hire Date
          </label>
          <input
            id="hireDate"
            type="date"
            v-model="hireDate"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': getServerError('hire_date')}"
            :disabled="isLoading"
          />
          <div v-if="getServerError('hire_date')" class="text-red-500 text-sm mt-1">
            {{ getServerError('hire_date') }}
          </div>
        </div>

        <!-- Status -->
        <div class="mb-4">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            v-model="status"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': statusError || getServerError('status')}"
            :disabled="isLoading"
          >
            <option value="">-- Select Status --</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div v-if="statusError" class="text-red-500 text-sm mt-1">
            {{ statusError }}
          </div>
          <div v-if="getServerError('status')" class="text-red-500 text-sm mt-1">
            {{ getServerError('status') }}
          </div>
        </div>

        <!-- Thumbnail (Image) -->
        <div class="mb-4">
          <label for="thumbnail" class="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="w-full"
            :disabled="isLoading"
          />
          <div v-if="getServerError('thumbnail')" class="text-red-500 text-sm mt-1">
            {{ getServerError('thumbnail') }}
          </div>
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
