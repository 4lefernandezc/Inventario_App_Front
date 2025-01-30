<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Inicio',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Administración',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
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
                label: 'Sucursales',
                icon: 'pi pi-fw pi-warehouse',
                to: '/pages/sucursales'
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
                icon: 'pi pi-fw pi-address-book',
                to: '/pages/clientes'
            }
        ]
    },
    {
        label: 'Demos',
        items: [
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud'
            },
            {
                label: 'Demo Ventas',
                icon: 'pi pi-fw pi-shopping-cart',
                to: '/demo-ventas'
            }, 
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
