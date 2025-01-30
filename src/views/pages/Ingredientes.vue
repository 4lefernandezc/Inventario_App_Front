<script setup lang="ts">
import PaginatorCommon from '@/components/PaginatorCommon.vue';
import { IngredientesService } from '@/service/IngredientesService';
import { ProveedoresService } from '@/service/ProveedoresService';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { nextTick, onMounted, ref } from 'vue';

interface Ingrediente {
    id?: number;
    codigo?: string;
    nombre?: string;
    descripcion?: string;
    precioCompra?: number;
    activo?: boolean;
    idProveedor?: number;
    proveedor?: {};
    fechaCreacion?: string;
    fechaModificacion?: string;
}

const proveedores = ref([]);
const ingredientes = ref([]);
const ingrediente = ref<Ingrediente>({});
const loading = ref(false);
const toast = useToast();
const ingredienteDialog = ref(false);
const deleteIngredienteDialog = ref(false);
const showFilters = ref(true);

// Filtros y parámetros de paginación
const filters = ref({
    page: 1,
    limit: 10,
    sord: 'ASC',
    sidx: 'id',
    codigo: null,
    nombre: null,
    idProveedor: null,
    precioCompra: null,
    descripcion: null,
    activo: null
});

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
        codigo: null,
        nombre: null,
        idProveedor: null,
        precioCompra: null,
        descripcion: null,
        activo: null
    };
    getProducts();
}

// Toggle filters visibility
function toggleFilters() {
    showFilters.value = !showFilters.value;
}

onMounted(async () => {
    getProducts();
    getProveedores();
});

async function getProducts() {
    loading.value = true;
    try {
        const response = await IngredientesService.getAll(filters.value);
        ingredientes.value = response.data.data;
        datatable.value.total = response.data.total;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar ingredientes', life: 3000 });
    } finally {
        loading.value = false;
    }
}

async function getProveedores() {
    try {
        const response = await ProveedoresService.getAll();
        proveedores.value = response.data.data;
        console.log(proveedores.value);
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar proveedores', life: 3000 });
    }
}

function openNew() {
    ingrediente.value = {
        codigo: '',
        nombre: '',
        descripcion: '',
        activo: false
    };
    ingredienteDialog.value = true;
}

function hideDialog() {
    ingredienteDialog.value = false;
}

function onPageChange(event: number) {
    filters.value.page = event;
    getProducts();
}

async function saveIngrediente() {
    if (ingrediente.value.id) {
        updateIngrediente(ingrediente.value.id, ingrediente.value);
    } else {
        createIngrediente();
    }
}

async function createIngrediente() {
    loading.value = true;
    try {
        await IngredientesService.create(ingrediente.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Ingrediente creado', life: 3000 });
        hideDialog();
        await getProducts();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el ingrediente', life: 3000 });
    } finally {
        loading.value = false;
    }
}

async function updateIngrediente(id: number, ingrediente: Ingrediente) {
    loading.value = true;
    try {
        const ingredienteToUpdate = { ...ingrediente, precioCompra: +ingrediente.precioCompra };
        delete ingredienteToUpdate.proveedor;
        delete ingredienteToUpdate.id;
        delete ingredienteToUpdate.fechaCreacion;
        delete ingredienteToUpdate.fechaModificacion;
        await IngredientesService.update(id, ingredienteToUpdate);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Ingrediente actualizado', life: 3000 });
        hideDialog();
        await getProducts();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el ingrediente', life: 3000 });
    } finally {
        loading.value = false;
    }
}

function confirmDeleteIngrediente(data: Ingrediente) {
    ingrediente.value = { ...data };
    deleteIngredienteDialog.value = true;
}

async function deleteIngrediente() {
    loading.value = true;
    try {
        await IngredientesService.delete(ingrediente.value.id);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Ingrediente eliminado', life: 3000 });
        deleteIngredienteDialog.value = false;
        await getProducts();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el ingrediente', life: 3000 });
    } finally {
        loading.value = false;
    }
}

function editIngrediente(data: Ingrediente) {
    ingrediente.value = { ...data };
    ingredienteDialog.value = true;
}

function onFilterChange() {
    filters.value.page = 1;
    if (filters.value.codigo === '') filters.value.codigo = null;
    if (filters.value.nombre === '') filters.value.nombre = null;
    if (filters.value.precioCompra === '') filters.value.precioCompra = null;  
    if (filters.value.idProveedor === '') filters.value.idProveedor = null;    
    getProducts();
}

function handleBlur(field: string) {
    nextTick(() => {
        if (filters.value[field] === '') {
            filters.value[field] = null;
        }
        if (field === 'precioCompra' && filters.value[field] !== null) {
            filters.value[field] = Number(filters.value[field]);
        }
        onFilterChange();
    });
}

</script>
<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo Ingrediente" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
            </template>
            <template #end>
                <Button :label="showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'" :icon="showFilters ? 'pi pi-eye-slash' : 'pi pi-eye'" severity="secondary" class="mr-2" @click="toggleFilters" />
                <Button label="Limpiar Filtros" icon="pi pi-filter-slash" severity="secondary" @click="clearFilters" />
            </template>
        </Toolbar>

        <DataTable :value="ingredientes" :loading="loading" dataKey="id" :filterDisplay="showFilters ? 'row' : 'menu'" :sortOrder="filters.sord === 'ASC' ? 1 : -1" :sortField="filters.sidx" showGridlines class="p-datatable-sm">
            <template #empty>
                <p class="text-center my-5">No se encontraron datos 🔎</p>
            </template>

            <!-- Índice columna -->
            <Column header="#" style="max-width: 50px">
                <template #body="slotProps">
                    {{ (filters.page - 1) * filters.limit + slotProps.index + 1 }}
                </template>
            </Column>

            <!-- Columnas con filtros -->
            <Column field="codigo" header="Código" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.codigo" type="text" class="p-inputtext-sm" placeholder="Buscar código" @blur="filters.codigo !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="nombre" header="Nombre" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.nombre" type="text" class="p-inputtext-sm" placeholder="Buscar nombre" @blur="filters.nombre !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="precioCompra" header="Precio Compra" :showFilterMenu="false">
                <template #filter>
                    <InputNumber v-if="showFilters" v-model="filters.precioCompra" mode="currency" currency="BOB" class="p-inputtext-sm" @blur="filters.precioCompra !== null ? handleBlur('precioCompra') : null" />
                </template>
                <template #body="slotProps"> {{ slotProps.data.precioCompra }} Bs </template>
            </Column>

            <Column field="proveedor.nombre" header="Proveedor" :showFilterMenu="false">
                <template #filter>
                    <Select v-if="showFilters" v-model="filters.idProveedor" :options="proveedores" optionLabel="nombre" optionValue="id" placeholder="Seleccionar proveedor" class="p-column-filter w-full" @change="onFilterChange" />
                </template>
            </Column>

            <Column field="activo" header="Estado" :showFilterMenu="false">
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
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editIngrediente(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteIngrediente(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <div class="flex justify-center mt-4">
            <PaginatorCommon :filters="filters" :datatable="datatable" @eToPage="onPageChange" @eRefresh="getProducts" />
        </div>

        <Dialog v-model:visible="ingredienteDialog" :style="{ width: '450px' }" :modal="true" header="Ingrediente">
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label for="codigo">Código</label>
                    <InputText v-model="ingrediente.codigo" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="nombre">Nombre</label>
                    <InputText v-model="ingrediente.nombre" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="descripcion">Descripción</label>
                    <Textarea v-model="ingrediente.descripcion" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="precioCompra">Precio Compra</label>
                    <InputNumber v-model="ingrediente.precioCompra" mode="currency" currency="BOB" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="proveedor">Proveedor</label>
                    <Select v-model="ingrediente.idProveedor" :options="proveedores" optionLabel="nombre" optionValue="id" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="activo">Activo</label>
                    <ToggleSwitch v-model="ingrediente.activo" :default-value="false" />
                </div>
                <div class="flex justify-end gap-2">
                    <Button label="Cancelar" class="p-button-text" @click="hideDialog" />
                    <Button label="Guardar" @click="saveIngrediente" />
                </div>
            </div>
        </Dialog>
        <Dialog v-model:visible="deleteIngredienteDialog" :style="{ width: '450px' }" :modal="true" header="Confirmar">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
                <span>¿Estás seguro de que quieres eliminar el ingrediente?</span>
            </div>
            <div class="flex justify-end gap-2">
                <Button label="No" class="p-button-text" @click="deleteIngredienteDialog = false" />
                <Button label="Sí" @click="deleteIngrediente" />
            </div>
        </Dialog>
    </div>
</template>