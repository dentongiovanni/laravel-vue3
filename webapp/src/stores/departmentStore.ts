import { defineStore } from 'pinia'
import { Resource } from '@/api/resource'
import type { ResourcePayload } from '@/api/resource'
import type { Department, DepartmentState } from '@/types/Department'

export const useDepartmentStore = defineStore('departments', {
  state: (): DepartmentState => ({
    departments: [],
    selected: null,
    successMessage: ''
  }),

  getters: {
    allDepartments(state): Department[] {
      return state.departments
    },
    currentDepartment(state): Department | null {
      return state.selected
    }
  },

  actions: {
    /**
     * Fetch departments: GET /api/departments
     */
    fetchDepartments(): Promise<void> {
      return new Promise((resolve, reject) => {
        Resource.query('departments')
          .then((data) => {
            this.departments = data
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    /**
     * Create (POST) a new department: POST /api/departments
     */
    addDepartments(payload: Omit<Department, 'id'>): Promise<Department> {
      return new Promise((resolve, reject) => {
        Resource.save({
          query: 'departments',
          ...payload,
        } as ResourcePayload)
          .then((response) => {
            this.departments.push(response)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    /**
     * Update (PUT) an existing department: PUT /api/departments/:id
     */
    updateDepartment(payload: Department): Promise<Department> {
      return new Promise((resolve, reject) => {
        Resource.update({
          query: 'departments',
          id: payload.id,
          ...payload,
        } as ResourcePayload)
          .then((response) => {
            const index = this.departments.findIndex((dpt) => dpt.id === response.id)
            if (index !== -1) {
              this.departments[index] = response
            }
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    /**
     * Delete (DELETE) a department: DELETE /api/departments/:id
     */
    deleteDepartment(departmentID: number | string): Promise<void> {
      return new Promise((resolve, reject) => {
        Resource.destroy({
          query: 'departments',
          id: departmentID,
        } as ResourcePayload)
          .then(() => {
            this.departments = this.departments.filter((dpt) => dpt.id !== departmentID)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    /**
     * Select a department by ID (no Promise needed).
     */
    selectDepartment(departmentID: number | string): void {
      const found = this.departments.find((dpt) => dpt.id === departmentID) || null
      this.selected = found
    },
  }
})
