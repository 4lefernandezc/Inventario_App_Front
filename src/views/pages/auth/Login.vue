<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useAuthStore } from '@/stores/index.ts';
import { ref } from 'vue';

const usuario = ref('');
const clave = ref('');
const error = ref('');
const isLoading = ref(false);
const checked = ref(false);

function onSubmit() {
    if (!usuario.value || !clave.value) {
        error.value = 'Por favor, completa todos los campos.';
        return;
    }

    error.value = '';
    isLoading.value = true;

    const authStore = useAuthStore();
    authStore
        .login(usuario.value, clave.value)
        .then(() => {
            console.log('Inicio de sesión exitoso.');
            console.log('Usuario:', authStore.user);
            console.log('Token:', authStore.token);
        })
        .catch(() => {
            error.value = 'Usuario o contraseña incorrectos.';
        })
        .finally(() => {
            isLoading.value = false;
        });
}
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to PrimeLand!</div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <form @submit.prevent="onSubmit" class="w-full">
                        <label for="usuario" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nombre de Usuario</label>
                        <InputText id="usuario" type="text" placeholder="Usuario" class="w-full md:w-[30rem] mb-8" v-model="usuario" />

                        <label for="clave" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="clave" v-model="clave" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                        </div>
                        <div v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</div>
                        <button type="submit" :disabled="isLoading" class="w-full bg-primary text-white py-2 px-4 rounded-md focus:outline-none hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
                        </button>
                    </form>
                    <div class="mt-4 text-sm text-gray-600">
                        <a href="#" class="text-primary hover:underline">¿Olvidaste tu contraseña?</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
