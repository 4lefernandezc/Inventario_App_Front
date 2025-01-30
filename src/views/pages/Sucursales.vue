<script setup lang="ts">
import { SucursalesService } from '@/service/SucursalesService';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

// {
//   "message": "La sucursal con ID 11 no puede ser eliminada porque tiene usuarios asociados.",
//   "error": "Bad Request",
//   "statusCode": 400
// }
// endpoint delete devuelve un error 400 aunque no tenga usuarios asociados

interface sucursal {
    id?: number;
    nombre?: string;
    telefono?: string;
    direccion?: string;
    correo?: string;
    activo?: boolean;
    fechaCreacion?: string;
    fechaModificacion?: string;
}

const sucursales = ref([]);
const sucursal = ref<sucursal>({});
const loading = ref(false);
const toast = useToast();
const sucursalDialog = ref(false);
const deleteSucursalDialog = ref(false);
const showFilters = ref(true);

const filters = ref({
    page: 1,
    limit: 10,
    sord: 'ASC',
    sidx: 'id',
    nombre: null,
    direccion: null,
    telefono: null,
    correo: null,
    activo: null
});

function openNew() {
    sucursal.value = {
        nombre: '',
        telefono: '',
        direccion: '',
        correo: null,
        activo: false
    };
    sucursalDialog.value = true;
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
        direccion: null,
        telefono: null,
        correo: null,
        activo: true
    };
    getSucursales();
}

function toggleFilters() {
    showFilters.value = !showFilters.value;
}

function hideDialog() {
    sucursalDialog.value = false;
}

function onPageChange(event: number) {
    filters.value.page = event;
    getSucursales();
}

function onFilterChange() {
    filters.value.page = 1;
    if (filters.value.nombre === '') filters.value.nombre = null;
    if (filters.value.direccion === '') filters.value.direccion = null;
    if (filters.value.telefono === '') filters.value.telefono = null;
    if (filters.value.correo === '') filters.value.correo = null;
    if (filters.value.activo === '') filters.value.activo = null;
    getSucursales();
}

function saveSucursal() {
    if (sucursal.value.id) {
        updateSucursal();
    } else {
        createSucursal();
    }
}

async function createSucursal() {
    try {
        await SucursalesService.create(sucursal.value);
        sucursalDialog.value = false;
        getSucursales();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Sucursal creada', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la sucursal', life: 3000 });
    }
}

async function updateSucursal() {
    try {
        const sucursalCopy = { ...sucursal.value };
        delete sucursalCopy.fechaCreacion;
        delete sucursalCopy.fechaModificacion;
        delete sucursalCopy.id;
        await SucursalesService.update(sucursal.value.id, sucursalCopy);
        sucursalDialog.value = false;
        getSucursales();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Sucursal actualizada', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la sucursal', life: 3000 });
    }
}

function editSucursal(suc: sucursal) {
    sucursal.value = { ...suc };
    sucursalDialog.value = true;
}

function confirmDeleteSucursal(suc: sucursal) {
    sucursal.value = { ...suc };
    deleteSucursalDialog.value = true;
}

async function deleteSucursal() {
    try {
        await SucursalesService.delete(sucursal.value.id);
        deleteSucursalDialog.value = false;
        getSucursales();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Sucursal eliminada', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la sucursal', life: 3000 });
    }
}

async function getSucursales() {
    loading.value = true;
    try {
        const response = await SucursalesService.getAll({
            ...filters.value
        });
        sucursales.value = response.data.data;
        datatable.value.total = response.data.total;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las sucursales', life: 3000 });
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    getSucursales();
});
</script>

<template>
    <div className="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nueva Sucursal" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
            </template>
            <template #end>
                <Button :label="showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'" :icon="showFilters ? 'pi pi-eye-slash' : 'pi pi-eye'" severity="secondary" class="mr-2" @click="toggleFilters" />
                <Button label="Limpiar Filtros" icon="pi pi-filter-slash" severity="secondary" @click="clearFilters" />
            </template>
        </Toolbar>
        <DataTable :value="sucursales" :loading="loading" dataKey="id" :filterDisplay="showFilters ? 'row' : 'menu'" :sortOrder="filters.sord === 'ASC' ? 1 : -1" :sortField="filters.sidx" showGridlines class="p-datatable-sm">
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

            <Column field="direccion" header="Dirección" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.direccion" type="text" class="p-inputtext-sm" placeholder="Buscar dirección" @blur="filters.direccion !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="telefono" header="Teléfono" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.telefono" type="text" class="p-inputtext-sm" placeholder="Buscar teléfono" @blur="filters.telefono !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="correo" header="Correo" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.correo" type="text" class="p-inputtext-sm" placeholder="Buscar correo" @blur="filters.correo !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="activo" header="Activo" :showFilterMenu="false">
                <template #filter>
                    <Select
                        v-if="showFilters"
                        v-model="filters.activo"
                        :options="[
                            { label: 'Todos', value: null },
                            { label: 'Activo', value: true },
                            { label: 'Inactivo', value: false }
                        ]"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Filtrar estado"
                        class="p-column-filter w-full"
                        @change="onFilterChange"
                    />
                </template>
                <template #body="slotProps">
                    <LabelStatus :isActive="slotProps.data.activo" />
                </template>
            </Column>

            <Column header="Acciones" style="min-width: 8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editSucursal(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteSucursal(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <div class="flex justify-center mt-4">
            <PaginatorCommon :filters="filters" :datatable="datatable" @eToPage="onPageChange" @eRefresh="getSucursales" />
        </div>
    </div>
    <Dialog v-model:visible="sucursalDialog" :style="{ width: '450px' }" :modal="true" header="Sucursal">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
                <label for="nombre">Nombre</label>
                <InputText v-model="sucursal.nombre" id="nombre" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="direccion">Dirección</label>
                <InputText v-model="sucursal.direccion" id="direccion" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="telefono">Teléfono</label>
                <InputText v-model="sucursal.telefono" id="telefono" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="correo">Correo</label>
                <InputText v-model="sucursal.correo" id="correo" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="activo">Activo</label>
                <ToggleSwitch v-model="sucursal.activo" :default-value="false" />
            </div>
            <div class="flex justify-end gap-2">
                <Button label="Cancelar" class="p-button-text" @click="hideDialog" />
                <Button label="Guardar" @click="saveSucursal" />
            </div>
        </div>
    </Dialog>

    <Dialog v-model:visible="deleteSucursalDialog" :style="{ width: '450px' }" :modal="true" header="Confirmar">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span>¿Estás seguro de que quieres eliminar esta Sucursal?</span>
        </div>
        <div class="flex justify-end gap-2">
            <Button label="Cancelar" class="p-button-text" @click="deleteSucursalDialog = false" />
            <Button label="Sí" @click="deleteSucursal()" />
        </div>
    </Dialog>
</template>