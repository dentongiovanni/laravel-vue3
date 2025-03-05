// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // Public Routes (No Auth Needed)
    {
      path: '/',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
        requiresAuth: false,
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
        requiresAuth: false,
      },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
        requiresAuth: false,
      },
    },

    // Protected Routes (Requires Auth)

    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
      },
    },

    {
      path: '/departments',
      name: 'Department', 
      meta: {
        title: 'Department',
        requiresAuth: true,
      },
      children: [
        {
          // Default child route: list of departments
          path: '',
          name: 'DepartmentList',
          component: () => import('../views/Departments/Department.vue'),
        },
        {
          // Child route for adding a department
          path: 'add',
          name: 'DepartmentAdd',
          component: () => import('../views/Departments/AddDepartment.vue'),
        },
        {
          path: ':id/edit',
          name: 'DepartmentEdit',
          component: () => import('@/views/Departments/EditDepartment.vue'),
          props: true
        }
      ],
    },

    {
      path: '/employees',
      name: 'Employees',
      meta: {
        title: 'Employees',
        requiresAuth: true,
      },
      children: [
        {
          // Default child route: list of departments
          path: '',
          name: 'EmployeeList',
          component: () => import('../views/Employees/Employees.vue'),
        },
        {
          // Child route for adding a department
          path: 'add',
          name: 'AddEmployee',
          component: () => import('../views/Employees/AddEmployee.vue'),
        },
        {
          path: ':id/edit',
          name: 'EditEmployee',
          component: () => import('@/views/Employees/EditEmployee.vue'),
          props: true
        }
      ],
    },


    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
        requiresAuth: true,
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
        requiresAuth: true,
      },
    },

    // ... other routes ...

    // Catch-All (404) Route must be last
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
        requiresAuth: false,
      },
    },
  ],
})

// Dynamically set document title and guard routes
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = `HRIS - ${to.meta.title}`

  // Check if route requires auth
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      // Not logged in? Redirect to Signin
      return next({ name: 'Signin' })
    }
  }

  // Otherwise, allow navigation
  next()
})

export default router
