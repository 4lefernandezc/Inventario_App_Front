<script setup lang="ts">
import { ClientesService } from '@/service/ClientesService';
import { FilterMatchMode } from '@primevue/core/api';
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

const clientes = ref([]);
const cliente = ref<Cliente>({});
const loading = ref(false);
const error = ref(null);
const toast = useToast();
const clienteDialog = ref(false);
const deleteClienteDialog = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const params = ref({
    page: 1,
    limit: 10,
    sord: 'ASC',
    sidx: 'id',
    documento: '',
    nombre: '',
    // activo: true
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
        const response = await ClientesService.getAll(params.value);
        clientes.value = response.data.data;
        console.log(clientes.value);
    } catch (e) {
        error.value = e;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    getClientes();
});
</script>

<template>
    <div className="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo Cliente" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew"/>
            </template>
        </Toolbar>
        <DataTable :value="clientes" :loading="loading" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" dataKey="id" :globalFilter="filters.global.value" :filters="filters">
            <Column field="documento" header="Documento" :filter="true"></Column>
            <Column field="tipoDocumento" header="Tipo Documento" :filter="true"></Column>
            <Column field="nombre" header="Nombre" :filter="true"></Column>
            <Column field="apellido" header="Apellido" :filter="true"></Column>
            <Column field="direccion" header="Dirección" :filter="true"></Column>
            <Column field="telefono" header="Teléfono" :filter="true"></Column>
            <Column field="correo" header="Correo" :filter="true"></Column>
            <Column header="Estado">
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
            <Column style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCliente(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCliente(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
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
