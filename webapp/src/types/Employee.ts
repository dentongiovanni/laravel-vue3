// @/types/Employee.ts
import type { Department } from './Department'

export interface Employee {
  id: number | string
  first_name: string,
  last_name: string,
  thumbnail?: string
  department?: Department
  hire_date?: string
  // ... other fields ...
}

export interface EmployeeState {
  employees: Employee[]
  selected: Employee | null
  successMessage: string
}
