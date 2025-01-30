<script setup lang="ts">
import PaginatorCommon from '@/components/PaginatorCommon.vue';
import { RolesService } from '@/service/RolesService';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

interface Rol {
    id?: number;
    nombre?: string;
    descripcion?: string;
    fechaCreacion?: string;
    fechaModificacion?: string;
}

const roles = ref([]);
const rol = ref<Rol>({});
const loading = ref(false);
const error = ref(null);
const toast = useToast();
const rolDialog = ref(false);
const deleteRolDialog = ref(false);
const showFilters = ref(true);

const filters = ref({
    page: 1,
    limit: 10,
    sord: 'ASC',
    sidx: 'id',
    nombre: null,
    descripcion: null
});

function openNew() {
    rol.value = {
        nombre: '',
        descripcion: ''
    };
    rolDialog.value = true;
}

const datatable = ref({
    total: 0
});

function clearFilters() {
    filters.value = {
        page: 1,
        limit: 10,
        sord: 'ASC',
        sidx: 'id',
        nombre: null,
        descripcion: null
    };
    getRoles();
}

function toggleFilters() {
    showFilters.value = !showFilters.value;
}

function hideDialog() {
    rolDialog.value = false;
}

function onPageChange(event: number) {
    filters.value.page = event;
    getRoles();
}

function onFilterChange() {
    filters.value.page = 1;
    if (filters.value.nombre === '') filters.value.nombre = null;
    if (filters.value.descripcion === '') filters.value.descripcion = null;
    getRoles();
}

function saveRol() {
    if (rol.value.id) {
        updateRol();
    } else {
        createRol();
    }
}

async function createRol() {
    try {
        await RolesService.create(rol.value);
        rolDialog.value = false;
        getRoles();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Rol creado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el rol', life: 3000 });
    }
}

async function updateRol() {
    try {
        const { id, fechaCreacion, fechaModificacion, ...rolData } = rol.value;
        await RolesService.update(id, rolData);
        rolDialog.value = false;
        getRoles();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Rol actualizado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el rol', life: 3000 });
    }
}

function confirmDeleteRol(role: Rol) {
    rol.value = { ...role };
    deleteRolDialog.value = true;
}

async function deleteRol() {
    try {
        await RolesService.delete(rol.value.id);
        deleteRolDialog.value = false;
        getRoles();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Rol eliminado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el rol', life: 3000 });
    }
}

function editRol(role: Rol) {
    rol.value = { ...role };
    rolDialog.value = true;
}

async function getRoles() {
    loading.value = true;
    try {
        const response = await RolesService.getAll({
            ...filters.value
        });
        roles.value = response.data.data;
        datatable.value.total = response.data.total;
    } catch (e) {
        error.value = e;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    getRoles();
});
</script>

<template>
    <div className="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo Rol" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
            </template>
            <template #end>
                <Button :label="showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'" :icon="showFilters ? 'pi pi-eye-slash' : 'pi pi-eye'" severity="secondary" class="mr-2" @click="toggleFilters" />
                <Button label="Limpiar Filtros" icon="pi pi-filter-slash" severity="secondary" @click="clearFilters" />
            </template>
        </Toolbar>
        <DataTable :value="roles" :loading="loading" dataKey="id" :filterDisplay="showFilters ? 'row' : 'menu'" :sortOrder="filters.sord === 'ASC' ? 1 : -1" :sortField="filters.sidx" showGridlines class="p-datatable-sm">
            <template #empty>
                <p class="text-center my-5">No se encontraron datos 🔎</p>
            </template>

            <!-- Índice columna -->
            <Column header="#" style="max-width: 50px">
                <template #body="slotProps">
                    {{ (filters.page - 1) * filters.limit + slotProps.index + 1 }}
                </template>
            </Column>

            <Column field="nombre" header="Nombre" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.nombre" type="text" class="p-inputtext-sm" placeholder="Buscar nombre" @blur="filters.nombre !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="descripcion" header="Descripción" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.descripcion" type="text" class="p-inputtext-sm" placeholder="Buscar descripción" @blur="filters.descripcion !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column header="Acciones" style="min-width: 8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editRol(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteRol(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <div class="flex justify-center mt-4">
            <PaginatorCommon :filters="filters" :datatable="datatable" @eToPage="onPageChange" @eRefresh="getRoles" />
        </div>
    </div>
    <Dialog v-model:visible="rolDialog" :style="{ width: '450px' }" :modal="true" header="Rol">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
                <label for="nombre">Nombre</label>
                <InputText v-model="rol.nombre" id="nombre" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="descripcion">Descripción</label>
                <Textarea v-model="rol.descripcion" id="descripcion" />
            </div>
            <div class="flex justify-end gap-2">
                <Button label="Cancelar" class="p-button-text" @click="hideDialog" />
                <Button label="Guardar" @click="saveRol" />
            </div>
        </div>
    </Dialog>
    <Dialog v-model="deleteRolDialog" header="Confirmación" :modal="true" :visible="deleteRolDialog" style="width: 300px" @hide="deleteRolDialog = false">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span>¿Estás seguro de que quieres eliminar el rol?</span>
        </div>
        <div class="p-d-flex p-jc-end">
            <Button label="No" class="p-button-text" @click="deleteRolDialog = false" />
            <Button label="Sí" class="p-button-danger" @click="deleteRol" />
        </div>
    </Dialog>
</template>
