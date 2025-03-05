<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

async function handleSubmit() {
  await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (!authStore.error) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 shadow-md rounded w-full max-w-sm">
      <h1 class="text-2xl font-semibold mb-4">Login</h1>

      <!-- Show error if login fails -->
      <div v-if="authStore.error" class="bg-red-100 text-red-700 p-2 rounded mb-4">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              required
              class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              class="absolute right-2 top-2 text-sm text-blue-600 hover:text-blue-800"
              @click="togglePasswordVisibility"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <!-- Keep Me Logged In -->
        <div class="mb-4 flex items-center">
          <input type="checkbox" v-model="keepLoggedIn" class="form-checkbox h-4 w-4 text-blue-600" />
          <span class="ml-2 text-gray-700">Keep me logged in</span>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          :disabled="authStore.isLoading"
        >
          <span v-if="authStore.isLoading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>
