import { getTokenFromLocalStorage } from '@/helpers';
import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/pages/ingredientes',
                    name: 'ingredientes',
                    component: () => import('@/views/pages/Ingredientes.vue')
                },
                {
                    path: '/pages/proveedores',
                    name: 'proveedores',
                    component: () => import('@/views/pages/Proveedores.vue')
                },
                {
                    path: '/pages/categorias',
                    name: 'categorias',
                    component: () => import('@/views/pages/Categorias.vue')
                },
                {
                    path: '/pages/roles',
                    name: 'roles',
                    component: () => import('@/views/pages/Roles.vue')
                },
                {
                    path: '/pages/usuarios',
                    name: 'usuarios',
                    component: () => import('@/views/pages/Usuarios.vue')
                },
                {
                    path: '/pages/clientes',
                    name: 'clientes',
                    component: () => import('@/views/pages/Clientes.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/demo-ventas',
                    name: 'demo-ventas',
                    component: () => import('@/demo/mockup-venta/pages/MockupVentaView.vue')
                }
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        }
    ]
});

router.beforeEach(async (to) => {
    const publicPages = ['/auth/login', '/'];
    const authRequired = !publicPages.includes(to.path);
    const authStore = useAuthStore();

    if (authRequired && !getTokenFromLocalStorage()) {
        if (authStore) authStore.logout();
        authStore.returnUrl = to.fullPath;
        return '/auth/login';
    }
});

export default router;
