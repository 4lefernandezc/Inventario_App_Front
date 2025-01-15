<script setup>
import { ProductosService } from '@/service/ProductosService';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { onMounted, ref } from 'vue';

const productos = ref([]);
const loading = ref(false);
const error = ref(null);
const params = ref({
    page: 1,
    limit: 10,
    sord: 'asc',
    sidx: '',
    codigo: '',
    nombre: '',
    active: true
});

const fetchProductos = async () => {
    loading.value = true;
    try {
        const response = await ProductosService.getAll(params.value);
        productos.value = response.data;
        console.log(productos.value);
    } catch (e) {
        error.value = e;
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchProductos();
});
</script>
<template>
    <div className="card">
        <DataTable :value="productos.data" :loading="loading" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" :currentPageReportTemplate="`Mostrando {first} a {last} de {totalRecords} productos`">
            <Column field="codigo" header="Código"></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="descripcion" header="Descripción"></Column>
            <Column field="precioCompra" header="Precio Compra"></Column>
            <Column field="precioVenta" header="Precio Venta"></Column>
            <Column field="activo" header="Activo"></Column>
            <Column field="categoria.nombre" header="Categoría"></Column>
            <Column field="proveedor.nombre" header="Proveedor"></Column>
        </DataTable>
    </div>
</template>
