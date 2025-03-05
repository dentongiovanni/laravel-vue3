<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useEmployeeStore } from '@/stores/employeesStore'
import EmployeesGrid from '@/views/Employees/EmployeesGrid.vue'
import DeleteEmployeeModal from '@/views/Employees/DeleteEmployeeModal.vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const currentPageTitle = ref('Employee List')
const employeesStore = useEmployeeStore()

const isDeleteModalOpen = ref(false)
const employeeToDelete = ref<number | string | null>(null)

const employees = computed(() => employeesStore.employees)

onMounted(() => {
  employeesStore.fetchEmployees()
})

const deleteEmployee = (id: number | string) => {
  employeeToDelete.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (!employeeToDelete.value) return

  employeesStore.deleteEmployee(employeeToDelete.value)
    .catch((error) => {
      console.error('Error deleting employee:', error)
    })
    .finally(() => {
      isDeleteModalOpen.value = false
      employeeToDelete.value = null
    })
}

const cancelDelete = () => {
  isDeleteModalOpen.value = false
  employeeToDelete.value = null
}

const editEmployee = (employeeID: number | string) => {
  router.push({ name: 'EditEmployee', params: { id: employeeID } })
}


</script>

<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Header with Add button -->
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90"></h3>
      <router-link :to="{ name: 'AddEmployee' }">
        <button 
          @click="addEmployee" 
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Employee
        </button>
      </router-link>
    </div>

    <!-- Employees Grid -->
    <EmployeesGrid
      :employees="employees"
      @editEmployee="editEmployee"
      @deleteEmployee="deleteEmployee"
    />
    
    <!-- Delete Modal -->
    <DeleteEmployeeModal
      v-if="isDeleteModalOpen"
      :employeeId="employeeToDelete"
      @confirmDelete="confirmDelete"
      @cancelDelete="cancelDelete"
    />
  </admin-layout>
</template>
