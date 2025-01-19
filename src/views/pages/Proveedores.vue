<script setup lang="ts">
import LabelStatus from '@/components/LabelStatus.vue';
import { ProveedoresService } from '@/service/ProveedoresService';
import { FilterMatchMode } from '@primevue/core/api';
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
}

const proveedores = ref([]);
const proveedor = ref<Proveedor>({});
const loading = ref(false);
const error = ref(null);
const toast = useToast();
const proveedorDialog = ref(false);
const deleteProveedorDialog = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function openNew() {
    proveedor.value = {};
    submitted.value = false;
    proveedorDialog.value = true;
}

function hideDialog() {
    proveedorDialog.value = false;
    submitted.value = false;
}

function saveProveedor() {
    submitted.value = true;

    if (!proveedor.value.nombre) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'El nombre es requerido', life: 3000 });
    }

    if (proveedor.value.id) {
        updateProveedor(proveedor.value.id, proveedor.value);
    } else {
        createProveedor();
    }
}

async function createProveedor() {
    console.log(proveedor.value);
    try {
        const response = await ProveedoresService.create(proveedor.value);
        proveedores.value.push(response.data);
        proveedorDialog.value = false;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor creado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el proveedor', life: 3000 });
    }
}

async function updateProveedor(id, prov) {
    try {
        const response = await ProveedoresService.update(id, prov);
        const index = proveedores.value.findIndex((val) => val.id === id);
        proveedores.value[index] = response.data.proveedor;
        proveedorDialog.value = false;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor actualizado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el proveedor', life: 3000 });
    }
}

function editProveedor(prov) {
    proveedor.value = prov;
    console.log(proveedor.value);
    proveedorDialog.value = true;
}

function confirmDeleteProveedor(prov) {
    proveedor.value = prov;
    deleteProveedorDialog.value = true;
}

function deleteProveedor() {
    try {
        ProveedoresService.delete(proveedor.value.id);
        proveedores.value = proveedores.value.filter((val) => val.id !== proveedor.value.id);
        deleteProveedorDialog.value = false;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor eliminado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el proveedor', life: 3000 });
    }
}

const fetchProveedores = async () => {
    loading.value = true;
    try {
        const response = await ProveedoresService.getAll();
        proveedores.value = response.data;
        console.log(proveedores.value);
    } catch (e) {
        error.value = e;
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchProveedores();
});
</script>

<template>
    <div className="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo Proveedor" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
            </template>
        </Toolbar>

        <DataTable
            ref="dt"
            :value="proveedores"
            dataKey="id"
            :loading="loading"
            :filters="filters"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            :currentPageReportTemplate="`Mostrando {first} a {last} de {totalRecords} proveedores`"
        >
            <Column field="nombre" header="Nombre"></Column>
            <Column field="direccion" header="Dirección"></Column>
            <Column field="telefono" header="Teléfono"></Column>
            <Column field="correo" header="Correo"></Column>
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
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProveedor(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProveedor(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
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
            <div class="flex flex-col gap-2">
                <label for="linkWhatsapp">Whatsapp</label>
                <InputText v-model="proveedor.linkWhatsapp" />
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
