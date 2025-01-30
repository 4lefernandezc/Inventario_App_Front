<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    }
                ]
            },
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud'
            },
            {
                label: 'Ingredientes',
                icon: 'pi pi-fw pi-th-large',
                to: '/pages/ingredientes'
            },
            {
                label: 'Proveedores',
                icon: 'pi pi-fw pi-truck',
                to: '/pages/proveedores'
            },
            {
                label: 'Categorias',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/categorias'
            },
            {
                label: 'Roles',
                icon: 'pi pi-fw pi-sliders-h',
                to: '/pages/roles'
            },
            {
                label: 'Usuarios',
                icon: 'pi pi-fw pi-users',
                to: '/pages/usuarios'
            },
            {
                label: 'Clientes',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/clientes'
            }
        ]
    },
    {
        label: 'Demos',
        items: [
            {
                label: 'Demo Ventas',
                icon: 'pi pi-fw pi-shopping-cart',
                to: '/demo-ventas'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
