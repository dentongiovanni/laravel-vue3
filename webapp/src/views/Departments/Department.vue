<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useRouter } from 'vue-router'
import { useDepartmentStore } from '@/stores/departmentStore'
import DepartmentGrid from '@/views/Departments/DepartmentGrid.vue'
import DeleteDepartmentModal  from './DeleteDepartmentModal.vue'


const router = useRouter()
const currentPageTitle = ref('Department List')
const infoMessage = ref('')
const isDeleteModalOpen = ref(false)
const departmentToDelete = ref<number | string | null>(null)
const departmentStore = useDepartmentStore()

const departments = computed(() => departmentStore.departments)

onMounted(() => {
  departmentStore.fetchDepartments()
 
   if (departmentStore.successMessage) {
    infoMessage.value = departmentStore.successMessage
    departmentStore.successMessage = ''
  }

})

watch(infoMessage, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      infoMessage.value = ''
    }, 5000)
  }
})


function editDepartment(departmentId: number | string) {

 router.push({ name: 'DepartmentEdit', params: { id: departmentId } })

}


async function deleteDepartment(departmentId: number | string) {
    departmentToDelete.value = departmentId
    isDeleteModalOpen.value = true
}


async function confirmDelete() {

  if (!departmentToDelete.value) return

  try {
    await departmentStore.deleteDepartment(departmentToDelete.value)
    infoMessage.value = 'Department deleted successfully!'
  } catch (error) {
    console.error('Error deleting department:', error)
  } finally {
    isDeleteModalOpen.value = false
    departmentToDelete.value = null
  }

}

function cancelDelete() {
  isDeleteModalOpen.value = false
  departmentToDelete.value = null
}
</script>

<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

      <!-- Info Message (only shows if infoMessage is non-empty) -->
      <div
      v-if="infoMessage"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
      role="alert">
      <span class="block sm:inline">{{ infoMessage }}</span>
    </div>

    <!-- Header with Add button -->
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
       
      </h3>
      <router-link :to="{ name: 'DepartmentAdd' }">
      <button 
        @click="addDepartment" 
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Add Department
      </button>
    </router-link>
    </div>

    <!-- Use the new DepartmentGrid component -->
    <div class="bg-white p-6 rounded-md shadow">
    <DepartmentGrid
      :departments="departments"
      @editDepartment="editDepartment"
      @deleteDepartment="deleteDepartment"
    />
    </div>

     <DeleteDepartmentModal
      v-if="isDeleteModalOpen"
      :departmentId="departmentToDelete"
      @confirmDelete="confirmDelete"
      @cancelDelete="cancelDelete"
    />
  </admin-layout>
</template>
