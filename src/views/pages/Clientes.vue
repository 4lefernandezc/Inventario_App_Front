<script setup lang="ts">
import PaginatorCommon from '@/components/PaginatorCommon.vue';
import { ClientesService } from '@/service/ClientesService';
import { Select } from 'primevue';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

interface Cliente {
    id?: number;
    documento?: string;
    tipoDocumento?: string;
    nombre?: string;
    apellido?: string;
    direccion?: string;
    telefono?: string;
    correo?: string;
    activo?: boolean;
    fechaCreacion?: string;
    linkWhatsapp?: string;
    fechaModificacion?: string;
}

const clientes = ref<Cliente[]>([]);
const cliente = ref<Cliente>({});
const loading = ref(false);
const toast = useToast();
const clienteDialog = ref(false);
const deleteClienteDialog = ref(false);
const showFilters = ref(true);

// Filtros extendidos
const filters = ref({
    page: 1,
    limit: 10,
    sord: 'ASC',
    sidx: 'id',
    documento: null,
    tipoDocumento: null,
    nombre: null,
    apellido: null,
    direccion: null,
    telefono: null,
    correo: null,
    activo: null
});

function openNew() {
    cliente.value = {
        documento: '',
        tipoDocumento: '',
        nombre: '',
        apellido: '',
        activo: false
    };
    clienteDialog.value = true;
}

const datatable = ref({
    total: 0
});

// Función para limpiar filtros
function clearFilters() {
    filters.value = {
        page: 1,
        limit: 10,
        sord: 'ASC',
        sidx: 'id',
        documento: '',
        tipoDocumento: '',
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        correo: '',
        activo: null
    };
    getClientes();
}

// Toggle filters visibility
function toggleFilters() {
    showFilters.value = !showFilters.value;
}

function hideDialog() {
    clienteDialog.value = false;
}

function saveCliente() {
    if (cliente.value.id) {
        updateCliente();
    } else {
        createCliente();
    }
}

async function createCliente() {
    loading.value = true;
    try {
        await ClientesService.create(cliente.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Creado', life: 3000 });
        hideDialog();
        await getClientes();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error creando Cliente', life: 3000 });
    } finally {
        loading.value = false;
    }
}

async function updateCliente() {
    loading.value = true;
    try {
        delete cliente.value.fechaCreacion;
        delete cliente.value.fechaModificacion;
        delete cliente.value.linkWhatsapp;
        console.log(cliente.value);
        await ClientesService.update(cliente.value.id, cliente.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Actualizado', life: 3000 });
        hideDialog();
        await getClientes();
    } catch (error) {
        let errorMessage = 'Error actualizando Cliente';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
    } finally {
        loading.value = false;
    }
}

async function deleteCliente() {
    loading.value = true;
    try {
        await ClientesService.delete(cliente.value.id);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Eliminado', life: 3000 });
        hideDialog();
        await getClientes();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error eliminando Cliente', life: 3000 });
    } finally {
        loading.value = false;
    }

    deleteClienteDialog.value = false;
}

function editCliente(clien: Cliente) {
    clienteDialog.value = true;
    cliente.value = { ...clien };
}

function confirmDeleteCliente(clien: Cliente) {
    deleteClienteDialog.value = true;
    cliente.value = { ...clien };
}

async function getClientes() {
    loading.value = true;
    try {
        const response = await ClientesService.getAll({
            ...filters.value
        });
        clientes.value = response.data.data;
        datatable.value.total = response.data.total;
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar clientes', life: 3000 });
    } finally {
        loading.value = false;
    }
}

function onPageChange(event: number) {
    filters.value.page = event;
    getClientes();
}

function onFilterChange() {
    filters.value.page = 1;
    getClientes();
}

onMounted(() => {
    getClientes();
});
</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo Cliente" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
            </template>
            <template #end>
                <Button :label="showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'" :icon="showFilters ? 'pi pi-eye-slash' : 'pi pi-eye'" severity="secondary" class="mr-2" @click="toggleFilters" />
                <Button label="Limpiar Filtros" icon="pi pi-filter-slash" severity="secondary" @click="clearFilters" />
            </template>
        </Toolbar>

        <DataTable :value="clientes" :loading="loading" dataKey="id" :filterDisplay="showFilters ? 'row' : 'menu'" :sortOrder="filters.sord === 'ASC' ? 1 : -1" :sortField="filters.sidx" showGridlines class="p-datatable-sm">
            <template #empty>
                <p class="text-center my-5">No se encontraron datos 🔎</p>
            </template>
            <!-- Indice columna -->
            <Column header="#" style="max-width: 50px">
                <template #body="slotProps">
                    {{ (filters.page - 1) * filters.limit + slotProps.index + 1 }}
                </template>
            </Column>

            <!-- Columns con filtros -->
            <Column field="nombre" header="Nombre" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.nombre" type="text" class="p-inputtext-sm" placeholder="Buscar por nombre" maxlength="30" @blur="onFilterChange" />
                </template>
            </Column>

            <Column field="apellido" header="Apellido" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.apellido" type="text" class="p-inputtext-sm" placeholder="Buscar apellido" @blur="onFilterChange" />
                </template>
            </Column>

            <Column field="documento" header="Documento" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.documento" type="text" class="p-inputtext-sm" placeholder="Buscar por documento" maxlength="30" @blur="onFilterChange" />
                </template>
            </Column>

            <Column field="tipoDocumento" header="Tipo Documento" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.tipoDocumento" type="text" class="p-inputtext-sm" placeholder="Buscar tipo" @blur="onFilterChange" />
                </template>
            </Column>

            <Column field="telefono" header="Teléfono" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.telefono" type="text" class="p-inputtext-sm" placeholder="Buscar teléfono" @blur="onFilterChange" />
                </template>
            </Column>

            <Column field="correo" header="Correo" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.correo" type="text" class="p-inputtext-sm" placeholder="Buscar correo" @blur="onFilterChange" />
                </template>
            </Column>

            <!-- Active status column -->
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

            <!-- WhatsApp and actions columns -->
            <Column field="linkWhatsapp" header="Whatsapp">
                <template #body="slotProps">
                    <a v-if="slotProps.data.linkWhatsapp && slotProps.data.linkWhatsapp !== ''" :href="slotProps.data.linkWhatsapp" target="_blank">
                        <Button :icon="`pi pi-whatsapp`" rounded />
                    </a>
                </template>
            </Column>

            <Column header="Acciones" style="min-width: 8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCliente(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCliente(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <div class="flex justify-center mt-4">
            <PaginatorCommon :filters="filters" :datatable="datatable" @eToPage="onPageChange" @eRefresh="getClientes" />
        </div>

        <Dialog v-model:visible="clienteDialog" :style="{ width: '450px' }" :modal="true" header="Cliente">
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label for="documento">Documento</label>
                    <InputText v-model="cliente.documento" id="documento" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="tipoDocumento">Tipo Documento</label>
                    <InputText v-model="cliente.tipoDocumento" id="tipoDocumento" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="nombre">Nombre</label>
                    <InputText v-model="cliente.nombre" id="nombre" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="apellido">Apellido</label>
                    <InputText v-model="cliente.apellido" id="apellido" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="direccion">Dirección</label>
                    <InputText v-model="cliente.direccion" id="direccion" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="telefono">Teléfono</label>
                    <InputText v-model="cliente.telefono" id="telefono" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="correo">Correo</label>
                    <InputText v-model="cliente.correo" id="correo" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="activo">Activo</label>
                    <ToggleSwitch v-model="cliente.activo" :default-value="false" />
                </div>
                <div class="flex justify-end gap-2">
                    <Button label="Cancelar" class="p-button-text" @click="hideDialog" />
                    <Button label="Guardar" @click="saveCliente" />
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="deleteClienteDialog" :style="{ width: '450px' }" :modal="true" header="Confirmar">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
                <span>¿Estás seguro de que quieres eliminar el proveedor?</span>
            </div>
            <div class="flex justify-end gap-2">
                <Button label="Cancelar" class="p-button-text" @click="deleteClienteDialog = false" />
                <Button label="Sí" @click="deleteCliente()" />
            </div>
        </Dialog>
    </div>
</template>
