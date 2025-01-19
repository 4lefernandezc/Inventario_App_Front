<script setup lang="ts">
import LabelStatus from '@/components/LabelStatus.vue';
import { CategoriasService } from '@/service/CategoriasService';
import { FilterMatchMode } from '@primevue/core/api';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

interface Categoria {
    id?: number;
    nombre?: string;
    descripcion?: string;
    activo?: boolean;
}

const categorias = ref([]);
const categoria = ref<Categoria>({});
const loading = ref(false);
const error = ref(null);
const toast = useToast();
const categoriaDialog = ref(false);
const deleteCategoriaDialog = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

function openNew() {
    categoria.value = {};
    categoriaDialog.value = true;
}

function hideDialog() {
    categoriaDialog.value = false;
}

function saveCategoria() {
    if (categoria.value.id) {
        updateCategoria(categoria.value.id, categoria.value);
    } else {
        createCategoria();
    }
}

async function createCategoria() {
    try {
        const response = await CategoriasService.create(categoria.value);
        categorias.value.push(response.data);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la categoría', life: 3000 });
    }
    categoriaDialog.value = false;
}

async function updateCategoria(id: number, categ: Categoria) {
    try {
        const response = await CategoriasService.update(id, categ);
        const index = categorias.value.findIndex((r) => r.id === id);
        categorias.value[index] = response.data.categoria;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la categoría', life: 3000 });
    }
    categoriaDialog.value = false;
}

function confirmDeleteCategoria(categ: Categoria) {
    categoria.value = categ;
    deleteCategoriaDialog.value = true;
}

async function deleteCategoria() {
    try {
        await CategoriasService.delete(categoria.value.id);
        categorias.value = categorias.value.filter((val) => val.id !== categoria.value.id);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría eliminada', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la categoría', life: 3000 });
    }
    deleteCategoriaDialog.value = false;
}

function editCategoria(categ: Categoria) {
    categoria.value = { ...categ };
    categoriaDialog.value = true;
}

async function getCategorias() {
    loading.value = true;
    try {
        const response = await CategoriasService.getAll();
        categorias.value = response.data;
        console.log(categorias.value);
    } catch (e) {
        error.value = e;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    getCategorias();
});
</script>

<template>
    <div className="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nueva Categoria" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
            </template>
        </Toolbar>
        <DataTable :value="categorias" :loading="loading" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" :globalFilter="filters.global.value" :filters="filters" dataKey="id">
            <Column field="nombre" header="Nombre" :filter="true"></Column>
            <Column field="descripcion" header="Descripción" :filter="true"></Column>
            <Column header="Estado">
                <template #body="slotProps">
                    <LabelStatus :isActive="slotProps.data.activo" />
                </template>
            </Column>
            <Column style="min-width: 12rem">
                <template #body="slotProps" header="Acciones">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategoria(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCategoria(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="categoriaDialog" :style="{ width: '450px' }" :modal="true" header="Categoria">
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label for="nombre">Nombre</label>
                    <InputText v-model="categoria.nombre" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="descripcion">Descripción</label>
                    <Textarea v-model="categoria.descripcion" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="activo">Activo</label>
                    <ToggleSwitch v-model="categoria.activo" :default-value="false" />
                </div>
                <div class="flex justify-end gap-2">
                    <Button label="Cancelar" class="p-button-text" @click="hideDialog" />
                    <Button label="Guardar" @click="saveCategoria" />
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="deleteCategoriaDialog" :style="{ width: '450px' }" :modal="true" header="Confirmar">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
                <span>¿Estás seguro de que quieres eliminar el rol?</span>
            </div>
            <div class="p-d-flex p-jc-end">
                <Button label="No" class="p-button-text" @click="deleteCategoriaDialog = false" />
                <Button label="Sí" class="p-button-danger" @click="deleteCategoria" />
            </div>
        </Dialog>
    </div>
</template>
