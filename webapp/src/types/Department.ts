export interface Department {
    id: number | string
    name: string
    description?: string
    created_at?: string
    updated_at?: string
  }
  
  export interface DepartmentState {
    departments: Department[]
    selected: Department | null,
    successMessage: string
  }
  