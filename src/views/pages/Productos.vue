<script setup lang="ts">
import LabelStatus from '@/components/LabelStatus.vue';
import { CategoriasService } from '@/service/CategoriasService';
import { ProductosService } from '@/service/ProductosService';
import { ProveedoresService } from '@/service/ProveedoresService';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';

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
const error = ref(null);
const toast = useToast();
const productoDialog = ref(false);
const deleteProductoDialog = ref(false);
const filters = ref(null);

const params = ref({
    page: 1,
    limit: 10,
    sord: 'ASC',
    sidx: 'id',
    codigo: '',
    nombre: '',
    // activo: true
});

onMounted(async () => {
    getProducts();
    getCategorias();
    getProveedores();
});

async function getProducts() {
    loading.value = true;
    try {
        const response = await ProductosService.getAll(params.value);
        productos.value = response.data.data;
        // to array
        productos.value = Object.keys(response.data.data).map((key) => response.data.data[key]);
        console.log(productos.value);
    } catch (e) {
        error.value = e;
    }
    loading.value = false;
}

async function getCategorias() {
    try {
        const response = await CategoriasService.getAll();
        categorias.value = response.data;
        console.log(categorias.value);
    } catch (e) {
        error.value = e;
    }
}

async function getProveedores() {
    try {
        const response = await ProveedoresService.getAll();
        proveedores.value = response.data;
        console.log(proveedores.value);
    } catch (e) {
        error.value = e;
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

function saveProducto() {
    if (producto.value.id) {
        updateProducto(producto.value.id, producto.value);
    } else {
        createProducto();
    }
}

async function createProducto() {
    try {
        const response = await ProductosService.create(producto.value);
        productos.value.push(response.data);
        getProducts();
        productoDialog.value = false;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto creado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el producto', life: 3000 });
    }
}

async function updateProducto(id: number, prod: Producto) {
    try {
        const prodToUpdate = { ...prod, precioCompra: +prod.precioCompra, precioVenta: +prod.precioVenta };
        delete prodToUpdate.categoria;
        delete prodToUpdate.proveedor;
        console.log(prodToUpdate);
        const response = await ProductosService.update(id, prodToUpdate);
        const index = productos.value.findIndex((p) => p.id === id);
        productos.value[index] = response.data.producto;
        getProducts();
        productoDialog.value = false;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el producto', life: 3000 });
    }
}

function confirmDeleteProducto(prod: Producto) {
    producto.value = prod;
    deleteProductoDialog.value = true;
}

async function deleteProducto() {
    try {
        await ProductosService.delete(producto.value.id);
        productos.value = productos.value.filter((val) => val.id !== producto.value.id);
        deleteProductoDialog.value = false;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto', life: 3000 });
    }
}

function editProducto(prod: Producto) {
    producto.value = { ...prod };
    productoDialog.value = true;
}
</script>
<template>
    <div className="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo Producto" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
            </template>
        </Toolbar>
        <DataTable
            v-model:filters="filters"
            :value="productos"
            :loading="loading"
            :globalFilterFields="['activo']"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            :currentPageReportTemplate="`Mostrando {first} a {last} de {totalRecords} productos`"
        >
            <Column field="codigo" header="Código" sortable></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="descripcion" header="Descripción"></Column>
            <Column field="precioCompra" header="Precio Compra"></Column>
            <Column field="precioVenta" header="Precio Venta"></Column>
            <Column field="categoria.nombre" header="Categoría"></Column>
            <Column field="proveedor.nombre" header="Proveedor"></Column>
            <Column header="Estado">
                <template #body="slotProps">
                    <LabelStatus :isActive="slotProps.data.activo" />
                </template>
            </Column>
            <Column style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProducto(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProducto(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
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
        <Dialog v-model="deleteProductoDialog" header="Confirmación" :visible="deleteProductoDialog" @hide="deleteProductoDialog = false">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
                <span>¿Estás seguro de que quieres eliminar el producto?</span>
            </div>
            <template #footer>
                <div class="p-d-flex p-jc-end">
                    <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductoDialog = false" />
                    <Button label="Sí" icon="pi pi-check" class="p-button-danger" @click="deleteProducto" />
                </div>
            </template>
        </Dialog>
    </div>
</template>
