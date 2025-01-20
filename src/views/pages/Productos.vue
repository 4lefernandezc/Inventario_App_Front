<script setup lang="ts">
import PaginatorCommon from '@/components/PaginatorCommon.vue';
import { CategoriasService } from '@/service/CategoriasService';
import { ProductosService } from '@/service/ProductosService';
import { ProveedoresService } from '@/service/ProveedoresService';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { nextTick, onMounted, ref } from 'vue';

interface Producto {
    id?: number;
    codigo?: string;
    nombre?: string;
    descripcion?: string;
    idCategoria?: number;
    precioCompra?: number;
    precioVenta?: number;
    activo?: boolean;
    idProveedor?: number;
    categoria?: {};
    proveedor?: {};
}

const categorias = ref([]);
const proveedores = ref([]);
const productos = ref([]);
const producto = ref<Producto>({});
const loading = ref(false);
const toast = useToast();
const productoDialog = ref(false);
const deleteProductoDialog = ref(false);
const showFilters = ref(true);

// Filtros y parámetros de paginación
const filters = ref({
    page: 1,
    limit: 10,
    sord: 'ASC',
    sidx: 'id',
    codigo: null,
    nombre: null,
    idCategoria: null,
    idProveedor: null,
    precioVenta: null,
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
        idCategoria: null,
        idProveedor: null,
        precioVenta: null,
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
    getCategorias();
    getProveedores();
});

async function getProducts() {
    loading.value = true;
    try {
        const response = await ProductosService.getAll(filters.value);
        productos.value = response.data.data;
        datatable.value.total = response.data.total;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar productos', life: 3000 });
    } finally {
        loading.value = false;
    }
}

async function getCategorias() {
    try {
        const response = await CategoriasService.getAll();
        categorias.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías', life: 3000 });
    }
}

async function getProveedores() {
    try {
        const response = await ProveedoresService.getAll();
        proveedores.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar proveedores', life: 3000 });
    }
}

function openNew() {
    producto.value = {
        codigo: '',
        nombre: '',
        descripcion: '',
        activo: false
    };
    productoDialog.value = true;
}

function hideDialog() {
    productoDialog.value = false;
}

function onPageChange(event: number) {
    filters.value.page = event;
    getProducts();
}

function onFilterChange() {
    filters.value.page = 1;
    if (filters.value.codigo === '') filters.value.codigo = null;
    if (filters.value.nombre === '') filters.value.nombre = null;
    getProducts();
}

async function saveProducto() {
    if (producto.value.id) {
        updateProducto(producto.value.id, producto.value);
    } else {
        createProducto();
    }
}

async function createProducto() {
    loading.value = true;
    try {
        await ProductosService.create(producto.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto creado', life: 3000 });
        hideDialog();
        await getProducts();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el producto', life: 3000 });
    } finally {
        loading.value = false;
    }
}

async function updateProducto(id: number, prod: Producto) {
    loading.value = true;
    try {
        const prodToUpdate = { ...prod, precioCompra: +prod.precioCompra, precioVenta: +prod.precioVenta };
        delete prodToUpdate.categoria;
        delete prodToUpdate.proveedor;
        await ProductosService.update(id, prodToUpdate);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
        hideDialog();
        await getProducts();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el producto', life: 3000 });
    } finally {
        loading.value = false;
    }
}

function confirmDeleteProducto(prod: Producto) {
    producto.value = prod;
    deleteProductoDialog.value = true;
}

async function deleteProducto() {
    loading.value = true;
    try {
        await ProductosService.delete(producto.value.id);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado', life: 3000 });
        deleteProductoDialog.value = false;
        await getProducts();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto', life: 3000 });
    } finally {
        loading.value = false;
    }
}

function editProducto(prod: Producto) {
    producto.value = { ...prod };
    productoDialog.value = true;
}

function handleBlur(field: string) {
    nextTick(() => {
        if (filters.value[field] === '') {
            filters.value[field] = null;
        }
        onFilterChange();
    });
}
</script>
<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo Producto" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
            </template>
            <template #end>
                <Button :label="showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'" :icon="showFilters ? 'pi pi-eye-slash' : 'pi pi-eye'" severity="secondary" class="mr-2" @click="toggleFilters" />
                <Button label="Limpiar Filtros" icon="pi pi-filter-slash" severity="secondary" @click="clearFilters" />
            </template>
        </Toolbar>

        <DataTable :value="productos" :loading="loading" dataKey="id" :filterDisplay="showFilters ? 'row' : 'menu'" :sortOrder="filters.sord === 'ASC' ? 1 : -1" :sortField="filters.sidx" showGridlines class="p-datatable-sm">
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
                    <InputText v-if="showFilters" v-model.trim="filters.nombre" type="text" class="p-inputtext-sm" placeholder="Buscar nombre" @blur="filters.codigo !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="precioCompra" header="Precio Compra" :showFilterMenu="false">
                <template #filter>
                    <InputNumber v-if="showFilters" v-model="filters.precioCompra" mode="currency" currency="BOB" class="p-inputtext-sm" @blur="filters.precioCompra !== null ? handleBlur('precioCompra') : null" />
                </template>
                <template #body="slotProps"> {{ slotProps.data.precioCompra }} Bs </template>
            </Column>

            <Column field="precioVenta" header="Precio Venta" :showFilterMenu="false">
                <template #filter>
                    <InputNumber v-if="showFilters" v-model="filters.precioVenta" mode="currency" currency="BOB" class="p-inputtext-sm" @blur="filters.precioCompra !== null ? handleBlur('precioVenta') : null" />
                </template>
                <template #body="slotProps"> {{ slotProps.data.precioVenta }} Bs </template>
            </Column>

            <Column field="categoria.nombre" header="Categoría" :showFilterMenu="false">
                <template #filter>
                    <Select v-if="showFilters" v-model="filters.idCategoria" :options="categorias" optionLabel="nombre" optionValue="id" placeholder="Seleccionar categoría" class="p-column-filter w-full" @change="onFilterChange" />
                </template>
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
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProducto(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProducto(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <div class="flex justify-center mt-4">
            <PaginatorCommon :filters="filters" :datatable="datatable" @eToPage="onPageChange" @eRefresh="getProducts" />
        </div>

        <Dialog v-model:visible="productoDialog" :style="{ width: '450px' }" :modal="true" header="Producto">
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label for="codigo">Código</label>
                    <InputText v-model="producto.codigo" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="nombre">Nombre</label>
                    <InputText v-model="producto.nombre" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="descripcion">Descripción</label>
                    <Textarea v-model="producto.descripcion" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="precioCompra">Precio Compra</label>
                    <InputNumber v-model="producto.precioCompra" mode="currency" currency="BOB" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="precioVenta">Precio Venta</label>
                    <InputNumber v-model="producto.precioVenta" mode="currency" currency="BOB" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="categoria">Categoría</label>
                    <Select v-model="producto.idCategoria" :options="categorias" optionLabel="nombre" optionValue="id" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="proveedor">Proveedor</label>
                    <Select v-model="producto.idProveedor" :options="proveedores" optionLabel="nombre" optionValue="id" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="activo">Activo</label>
                    <ToggleSwitch v-model="producto.activo" :default-value="false" />
                </div>
                <div class="flex justify-end gap-2">
                    <Button label="Cancelar" class="p-button-text" @click="hideDialog" />
                    <Button label="Guardar" @click="saveProducto" />
                </div>
            </div>
        </Dialog>
        <Dialog v-model:visible="deleteProductoDialog" :style="{ width: '450px' }" :modal="true" header="Confirmar">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
                <span>¿Estás seguro de que quieres eliminar el producto?</span>
            </div>
            <div class="flex justify-end gap-2">
                <Button label="No" class="p-button-text" @click="deleteProductoDialog = false" />
                <Button label="Sí" @click="deleteProducto" />
            </div>
        </Dialog>
    </div>
</template>
