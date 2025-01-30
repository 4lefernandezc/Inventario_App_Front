<script setup lang="ts">
import LabelStatus from '@/components/LabelStatus.vue';
import PaginatorCommon from '@/components/PaginatorCommon.vue';
import { ProveedoresService } from '@/service/ProveedoresService';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

interface Proveedor {
    id?: number;
    nombre?: string;
    nit?: string;
    telefono?: string;
    direccion?: string;
    correo?: string;
    linkWhatsapp?: string;
    activo?: boolean;
    fechaCreacion?: string;
    fechaModificacion?: string;
}

const proveedores = ref<Proveedor[]>([]);
const proveedor = ref<Proveedor>({});
const loading = ref(false);
const error = ref(null);
const toast = useToast();
const proveedorDialog = ref(false);
const deleteProveedorDialog = ref(false);
const showFilters = ref(true);

const filters = ref({
    page: 1,
    limit: 10,
    sord: 'ASC',
    sidx: 'id',
    nombre: null,
    nit: null,
    telefono: null,
    direccion: null,
    correo: null,
    activo: null
});

function openNew() {
    proveedor.value = {
        nombre: '',
        nit: '',
        telefono: '',
        direccion: null,
        correo: null,
        activo: false
    };
    proveedorDialog.value = true;
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
        nit: null,
        telefono: null,
        direccion: null,
        correo: null,
        activo: null
    };
    getProveedores();
}

function toggleFilters() {
    showFilters.value = !showFilters.value;
}

function hideDialog() {
    proveedorDialog.value = false;
}

function onPageChange(event: number) {
    filters.value.page = event;
    getProveedores();
}

function onFilterChange() {
    filters.value.page = 1;
    if (filters.value.nombre === '') filters.value.nombre = null;
    if (filters.value.nit === '') filters.value.nit = null;
    if (filters.value.telefono === '') filters.value.telefono = null;
    if (filters.value.direccion === '') filters.value.direccion = null;
    if (filters.value.correo === '') filters.value.correo = null;
    getProveedores();
}

function saveProveedor() {
    loading.value = true;

    if (proveedor.value.id) {
        updateProveedor();
    } else {
        createProveedor();
    }

    loading.value = false;
}

async function createProveedor() {
    try {
        await ProveedoresService.create(proveedor.value);
        proveedorDialog.value = false;
        getProveedores();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor creado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el proveedor', life: 3000 });
    }
}

async function updateProveedor() {
    try {
        const { id, fechaCreacion, fechaModificacion, ...updateData } = proveedor.value;
        await ProveedoresService.update(id, updateData);
        proveedorDialog.value = false;
        getProveedores();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor actualizado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el proveedor', life: 3000 });
    }
}

function editProveedor(prov: Proveedor) {
    proveedor.value = { ...prov };
    proveedorDialog.value = true;
}

async function getProveedores() {
    loading.value = true;
    try {
        const response = await ProveedoresService.getAll({
            ...filters.value
        });
        proveedores.value = response.data.data;
        datatable.value.total = response.data.total;
    } catch (e) {
        error.value = e;
    } finally {
        loading.value = false;
    }
}

function confirmDeleteProveedor(prov: Proveedor) {
    proveedor.value = { ...prov };
    deleteProveedorDialog.value = true;
}

async function deleteProveedor() {
    try {
        await ProveedoresService.delete(proveedor.value.id);
        deleteProveedorDialog.value = false;
        getProveedores();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor eliminado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el proveedor', life: 3000 });
    }
}

onMounted(() => {
    getProveedores();
});
</script>

<template>
    <div className="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo Proveedor" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
            </template>
            <template #end>
                <Button :label="showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'" :icon="showFilters ? 'pi pi-eye-slash' : 'pi pi-eye'" severity="secondary" class="mr-2" @click="toggleFilters" />
                <Button label="Limpiar Filtros" icon="pi pi-filter-slash" severity="secondary" @click="clearFilters" />
            </template>
        </Toolbar>

        <DataTable :value="proveedores" :loading="loading" dataKey="id" :filterDisplay="showFilters ? 'row' : 'menu'" :sortOrder="filters.sord === 'ASC' ? 1 : -1" :sortField="filters.sidx" showGridlines class="p-datatable-sm">
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

            <Column field="nit" header="Nit" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.nit" type="text" class="p-inputtext-sm" placeholder="Buscar nit" @blur="filters.nit !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="telefono" header="Teléfono" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.telefono" type="text" class="p-inputtext-sm" placeholder="Buscar teléfono" @blur="filters.telefono !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="direccion" header="Dirección" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.direccion" type="text" class="p-inputtext-sm" placeholder="Buscar dirección" @blur="filters.direccion !== null ? onFilterChange() : null" />
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

            <Column field="linkWhatsapp" header="Whatsapp">
                <template #body="slotProps">
                    <a v-if="slotProps.data.linkWhatsapp && slotProps.data.linkWhatsapp !== ''" :href="slotProps.data.linkWhatsapp" target="_blank">
                        <Button :icon="`pi pi-whatsapp`" rounded />
                    </a>
                </template>
            </Column>

            <Column header="Acciones" style="min-width: 8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProveedor(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProveedor(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <div class="flex justify-center mt-4">
            <PaginatorCommon :filters="filters" :datatable="datatable" @eToPage="onPageChange" @eRefresh="getProveedores" />
        </div>
    </div>

    <Dialog v-model:visible="proveedorDialog" :style="{ width: '450px' }" :modal="true" header="Proveedor">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
                <label for="nombre">Nombre</label>
                <InputText v-model="proveedor.nombre" required="true" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="direccion">Dirección</label>
                <InputText v-model="proveedor.direccion" required="true" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="direccion">Nit</label>
                <InputText v-model="proveedor.nit" required="true" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="telefono">Teléfono</label>
                <InputText v-model="proveedor.telefono" required="true" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="correo">Correo</label>
                <InputText v-model="proveedor.correo" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="activo">Activo</label>
                <ToggleSwitch v-model="proveedor.activo" :default-value="false" />
            </div>
            <div class="flex justify-end gap-2">
                <Button label="Cancelar" class="p-button-text" @click="hideDialog" />
                <Button label="Guardar" @click="saveProveedor" />
            </div>
        </div>
    </Dialog>

    <Dialog v-model:visible="deleteProveedorDialog" :style="{ width: '450px' }" :modal="true" header="Confirmar">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span>¿Estás seguro de que quieres eliminar el proveedor?</span>
        </div>
        <div class="flex justify-end gap-2">
            <Button label="Cancelar" class="p-button-text" @click="deleteProveedorDialog = false" />
            <Button label="Sí" @click="deleteProveedor()" />
        </div>
    </Dialog>
</template>
