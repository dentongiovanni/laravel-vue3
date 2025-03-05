<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useEmployeeStore } from '@/stores/employeesStore'
import { useDepartmentStore } from '@/stores/departmentStore'


const currentPageTitle = ref('Edit Employee')

// Basic references
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)

const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()

const departments = computed(() => departmentStore.departments)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const departmentId = ref<number | string>('')
const hireDate = ref('')
const status = ref('')
const thumbnailFile = ref<File | null>(null)

const firstNameError = ref('')
const lastNameError = ref('')
const emailError = ref('')
const departmentError = ref('')
const statusError = ref('')
const serverErrors = ref<any>({})

const loadEmployee = () => {
  const employeeId = route.params.id
  const employee = employeeStore.employees.find(
    (emp) => String(emp.id) === String(employeeId)
  )

  if (!employee) {
    router.push({ name: 'EmployeeList' })
    return
  }

  firstName.value = employee.first_name
  lastName.value = employee.last_name
  email.value = employee.email
  departmentId.value = employee.department?.id || ''
  hireDate.value = employee.hire_date || ''
  status.value = employee.status || ''
}

 onMounted(async () => {
  await departmentStore.fetchDepartments()  
  await loadEmployee()
})

watch(firstName, (newVal) => {
  if (newVal.trim()) firstNameError.value = ''
})
watch(lastName, (newVal) => {
  if (newVal.trim()) lastNameError.value = ''
})
watch(email, (newVal) => {
  if (newVal.trim()) emailError.value = ''
})
watch(departmentId, (newVal) => {
  if (newVal) departmentError.value = ''
})
watch(status, (newVal) => {
  if (newVal.trim()) statusError.value = ''
})


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
  if (!departmentId.value) {
    departmentError.value = 'Please select a department.'
    valid = false
  }
  if (!status.value.trim()) {
    statusError.value = 'Please select a status.'
    valid = false
  }

  return valid
}


const handleFileChange = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files
  thumbnailFile.value = fileList && fileList.length > 0 ? fileList[0] : null
}


const handleSubmit = () => {
  if (!validateForm()) return

  isLoading.value = true

  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('id', String(route.params.id))
  formData.append('first_name', firstName.value)
  formData.append('last_name', lastName.value)
  formData.append('email', email.value)
  formData.append('department_id', String(departmentId.value))
  formData.append('hire_date', hireDate.value || '')
  formData.append('status', status.value)

  if (thumbnailFile.value) {
    formData.append('thumbnail', thumbnailFile.value)
  }

  employeeStore.updateEmployee(formData)
    .then(() => {
      employeeStore.successMessage = 'Employee updated successfully!'
      router.push({ name: 'EmployeeList' })
    })
    .catch((error) => {
      if (error.response && error.response.status === 422) {
        serverErrors.value = error.response.data
      } else {
        console.error('Error updating employee:', error)
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="flex justify-between items-center mb-5">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90"></h3>
      <router-link :to="{ name: 'EmployeeList' }">
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Back
        </button>
      </router-link>
    </div>

    <div class="relative bg-white p-6 rounded-md shadow">
      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10"
      >
        <div class="text-white font-semibold">Processing...</div>
      </div>

      <h2 class="text-xl font-semibold mb-4">Edit Employee</h2>
      <form @submit.prevent="handleSubmit">
        <!-- First Name -->
        <div class="mb-4">
          <label
            for="firstName"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            v-model="firstName"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': firstNameError}"
            :disabled="isLoading"
          />
          <div v-if="firstNameError" class="text-red-500 text-sm mt-1">
            {{ firstNameError }}
          </div>
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label
            for="lastName"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            v-model="lastName"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': lastNameError}"
            :disabled="isLoading"
          />
          <div v-if="lastNameError" class="text-red-500 text-sm mt-1">
            {{ lastNameError }}
          </div>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            v-model="email"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': emailError}"
            :disabled="isLoading"
          />
          <div v-if="emailError" class="text-red-500 text-sm mt-1">
            {{ emailError }}
          </div>
        </div>

        <!-- Department -->
        <div class="mb-4">
          <label
            for="departmentId"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Department
          </label>
          <select
            id="departmentId"
            v-model="departmentId"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': departmentError}"
            :disabled="isLoading"
          >
            <option value="">-- Select Department --</option>
            <option
              v-for="dept in departments"
              :key="dept.id"
              :value="dept.id"
              :selected="departmentId===dept.id"
            >
              {{ dept.name }}
            </option>
          </select>
          <div v-if="departmentError" class="text-red-500 text-sm mt-1">
            {{ departmentError }}
          </div>
        </div>

        <!-- Hire Date -->
        <div class="mb-4">
          <label
            for="hireDate"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Hire Date
          </label>
          <input
            id="hireDate"
            type="date"
            v-model="hireDate"
            class="w-full border rounded px-3 py-2"
            :disabled="isLoading"
          />
        </div>

        <!-- Status -->
        <div class="mb-4">
          <label
            for="status"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            v-model="status"
            class="w-full border rounded px-3 py-2"
            :class="{'border-red-500': statusError}"
            :disabled="isLoading"
          >
            <option value="">-- Select Status --</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div v-if="statusError" class="text-red-500 text-sm mt-1">
            {{ statusError }}
          </div>
        </div>

        <!-- Thumbnail (if updating image is allowed) -->
        <div class="mb-4">
          <label
            for="thumbnail"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
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
