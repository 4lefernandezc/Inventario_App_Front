<script setup lang="ts">
import { RolesService } from '@/service/RolesService';
import { FilterMatchMode } from '@primevue/core/api';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

interface Rol {
    id?: number;
    nombre?: string;
    descripcion?: string;
}

const roles = ref([]);
const rol = ref<Rol>({});
const loading = ref(false);
const error = ref(null);
const toast = useToast();
const rolDialog = ref(false);
const deleteRolDialog = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

function openNew() {
    rol.value = {};
    rolDialog.value = true;
}

function hideDialog() {
    rolDialog.value = false;
}

function saveRol() {
    if (rol.value.id) {
        updateRol(rol.value.id, rol.value);
    } else {
        createRol();
    }
}

async function createRol() {
    try {
        const response = await RolesService.create(rol.value);
        roles.value.push(response.data);
        rolDialog.value = false;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Rol creado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el rol', life: 3000 });
    }
}

async function updateRol(id: number, rol: Rol) {
    try {
        const response = await RolesService.update(id, rol);
        const index = roles.value.findIndex((r) => r.id === id);
        roles.value[index] = response.data.rol;
        rolDialog.value = false;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Rol actualizado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el rol', life: 3000 });
    }
}

function confirmDeleteRol(role: Rol) {
    rol.value = role;
    deleteRolDialog.value = true;
}

async function deleteRol() {
    try {
        await RolesService.delete(rol.value.id);
        roles.value = roles.value.filter((val) => val.id !== rol.value.id);
        deleteRolDialog.value = false;
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
        const response = await RolesService.getAll();
        roles.value = response.data;
        console.log(roles.value);
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
                <Button label="Nuevo Rol" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew"/>
            </template>
        </Toolbar>
        <DataTable :value="roles" :loading="loading" :rows="10" :globalFilter="filters.global.value" :filters="filters" dataKey="id">
            <template #empty>
                <p class="text-center my-5">No se encontraron datos 🔎</p>
            </template>
            <Column header="#" xstyle="max-width: 50px">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column field="nombre" header="Nombre" filterMatchMode="contains"></Column>
            <Column field="descripcion" header="Descripción" filterMatchMode="contains"></Column>
            <Column header="Acciones" style="min-width: 8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editRol(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteRol(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
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
    </div>
</template>
