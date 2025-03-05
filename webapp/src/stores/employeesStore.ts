import { defineStore } from 'pinia'
import { Resource } from '@/api/resource'
import type { ResourcePayload } from '@/api/resource'
import type { Employee, EmployeeState } from '@/types/Employee'


type AddEmployeePayload = FormData | Omit<Employee, 'id'>
type UpdateEmployeePayload = FormData | Employee

export const useEmployeeStore = defineStore('employees', {
  // --------------------
  // STATE
  // --------------------
  state: (): EmployeeState => ({
    employees: [],
    selected: null,
    successMessage: ''
  }),

  // --------------------
  // GETTERS
  // --------------------
  getters: {
    allEmployees(state): Employee[] {
      return state.employees
    },
    currentEmployee(state): Employee | null {
      return state.selected
    },
  },

  // --------------------
  // ACTIONS
  // --------------------
  actions: {

    fetchEmployees(): Promise<void> {
      return Resource.query('employees')
        .then((data) => {
          this.employees = data
        })
        .catch((error) => {
          console.error('Error fetching employees:', error)
          throw error
        })
    },

    /**
     * Create (POST) a new employee: POST /api/employees
     */
    addEmployee(payload: AddEmployeePayload): Promise<any> {
      return new Promise((resolve, reject) => {
        let resourcePayload: ResourcePayload

        if (payload instanceof FormData) {
          resourcePayload = { query: 'employees', formData: payload }
        } else {
          resourcePayload = { query: 'employees', ...payload }
        }

        Resource.save(resourcePayload)
          .then((response) => {
            this.employees.push(response)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    /**
     * Update (PUT) an existing employee: PUT /api/employees/:id
     */
    updateEmployee(payload: UpdateEmployeePayload): Promise<any> {
      return new Promise((resolve, reject) => {
        let resourcePayload: ResourcePayload

        if (payload instanceof FormData) {
          const employeeId = payload.get('id')
          resourcePayload = { query: 'employees', id: employeeId, formData: payload }
        } else {
          resourcePayload = { query: 'employees', id: payload.id, ...payload }
        }

        Resource.update(resourcePayload)
          .then((response) => {
            const index = this.employees.findIndex((emp) => emp.id === response.id)
            if (index !== -1) {
              this.employees[index] = response
            }
            resolve(response)
          })
          .catch((error) => {
             reject(error)
          })
      })
    },

    /**
     * Delete (DELETE) an employee: DELETE /api/employees/:id
     */
    deleteEmployee(employeeId: number | string): Promise<void> {
      return new Promise((resolve, reject) => {
        const resourcePayload: ResourcePayload = { query: 'employees', id: employeeId }

        Resource.destroy(resourcePayload)
          .then(() => {
            this.employees = this.employees.filter((emp) => emp.id !== employeeId)
            resolve()
          })
          .catch((error) => {
            console.error('Error deleting employee:', error)
            reject(error)
          })
      })
    },

    /**
     * Select an employee by ID (no Promise needed).
     */
    selectEmployee(employeeId: number | string): void {
      const found = this.employees.find((emp) => emp.id === employeeId) || null
      this.selected = found
    },
  },
})
