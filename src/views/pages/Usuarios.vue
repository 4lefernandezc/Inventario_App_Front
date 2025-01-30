<script setup lang="ts">
import PaginatorCommon from '@/components/PaginatorCommon.vue';
import { RolesService } from '@/service/RolesService';
import { SucursalesService } from '@/service/SucursalesService';
import { UsuariosService } from '@/service/UsuariosService';
import { Select } from 'primevue';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

interface Usuario {
    id?: number;
    usuario?: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    correo?: string;
    clave?: string;
    activo?: boolean;
    rolId?: number;
    sucursalId?: number;
    ultimoLogin?: Date;
    fechaCreacion?: string;
    fechaModificacion?: string;
    rol?: {};
    sucursal?: {};
}

const roles = ref([]);
const sucursales = ref([]);
const usuarios = ref<Usuario[]>([]);
const usuario = ref<Usuario>({});
const loading = ref(false);
const toast = useToast();
const usuarioDialog = ref(false);
const deleteUsuarioDialog = ref(false);
const showFilters = ref(true);

// Filtros extendidos
const filters = ref({
    page: 1,
    limit: 10,
    sord: 'ASC',
    sidx: 'id',
    usuario: null,
    nombre: null,
    apellido: null,
    telefono: null,
    correo: null,
    activo: null,
    rolId: null,
    sucursalId: null
});

const filtersRol = ref({
    page: 1,
    limit: 20,
    sord: 'ASC',
    sidx: 'nombre'
});

const filtersSuc = ref({
    page: 1,
    limit: 20,
    sord: 'ASC',
    sidx: 'nombre'
});

function openNew() {
    usuario.value = {
        usuario: '',
        nombre: '',
        apellido: '',
        telefono: '',
        correo: null,
        clave: '',
        activo: false
    };
    usuarioDialog.value = true;
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
        usuario: null,
        nombre: null,
        apellido: null,
        telefono: null,
        correo: null,
        rolId: null,
        sucursalId: null,
        activo: null
    };
    getUsuarios();
}

// Toggle filters visibility
function toggleFilters() {
    showFilters.value = !showFilters.value;
}

function hideDialog() {
    usuarioDialog.value = false;
}

function saveUsuario() {
    const usuarioToSave = { ...usuario.value };
    delete usuarioToSave.ultimoLogin;
    delete usuarioToSave.rol;
    delete usuarioToSave.sucursal;

    if (usuarioToSave.id) {
        delete usuarioToSave.clave;
        updateUsuario();
    } else {
        createUsuario();
    }
}

async function createUsuario() {
    loading.value = true;
    try {
        await UsuariosService.create(usuario.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario Creado', life: 3000 });
        hideDialog();
        await getUsuarios();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error creando Usuario', life: 3000 });
    } finally {
        loading.value = false;
    }
}

async function updateUsuario() {
    loading.value = true;
    try {
        const usuarioToUpdate = { ...usuario.value };
        delete usuarioToUpdate.id;
        delete usuarioToUpdate.ultimoLogin;
        delete usuarioToUpdate.rol;
        delete usuarioToUpdate.sucursal;
        delete usuarioToUpdate.fechaCreacion;
        delete usuarioToUpdate.fechaModificacion;
        await UsuariosService.update(usuario.value.id, usuarioToUpdate);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario Actualizado', life: 3000 });
        hideDialog();
        await getUsuarios();
    } catch (error) {
        let errorMessage = 'Error actualizando Usuario';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
    } finally {
        loading.value = false;
    }
}

async function deleteUsuario() {
    loading.value = true;
    try {
        await UsuariosService.delete(usuario.value.id);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario Eliminado', life: 3000 });
        hideDialog();
        await getUsuarios();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error eliminando Usuario', life: 3000 });
    } finally {
        loading.value = false;
    }

    deleteUsuarioDialog.value = false;
}

function editUsuario(clien: Usuario) {
    usuarioDialog.value = true;
    usuario.value = { ...clien };
}

function confirmDeleteUsuario(clien: Usuario) {
    deleteUsuarioDialog.value = true;
    usuario.value = { ...clien };
}

async function getRoles() {
    try {
        const response = await RolesService.getAll({
            ...filtersRol.value
        });
        roles.value = response.data.data;
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar roles', life: 3000 });
    }
}

async function getSucursales() {
    try {
        const response = await SucursalesService.getAll({
            ...filtersSuc.value
        });
        sucursales.value = response.data.data;
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar sucursales', life: 3000 });
    }
}

async function getUsuarios() {
    loading.value = true;
    try {
        const response = await UsuariosService.getAll({
            ...filters.value
        });
        usuarios.value = response.data.data;
        datatable.value.total = response.data.total;
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar usuarios', life: 3000 });
    } finally {
        loading.value = false;
    }
}

function onPageChange(event: number) {
    filters.value.page = event;
    getUsuarios();
    getRoles();
    getSucursales();
}

function onFilterChange() {
    filters.value.page = 1;
    if (filters.value.usuario === '') filters.value.usuario = null;
    if (filters.value.nombre === '') filters.value.nombre = null;
    if (filters.value.apellido === '') filters.value.apellido = null;
    if (filters.value.telefono === '') filters.value.telefono = null;
    if (filters.value.rolId === '') filters.value.rolId = null;
    if (filters.value.sucursalId === '') filters.value.sucursalId = null;
    if (filters.value.correo === '') filters.value.correo = null;
    if (filters.value.activo === '') filters.value.activo = null;
    getUsuarios();
}

onMounted(() => {
    getUsuarios();
    getRoles();
    getSucursales();
});
</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo Usuario" icon="pi pi-plus" severity="primary" class="mr-2" @click="openNew" />
            </template>
            <template #end>
                <Button :label="showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'" :icon="showFilters ? 'pi pi-eye-slash' : 'pi pi-eye'" severity="secondary" class="mr-2" @click="toggleFilters" />
                <Button label="Limpiar Filtros" icon="pi pi-filter-slash" severity="secondary" @click="clearFilters" />
            </template>
        </Toolbar>

        <DataTable :value="usuarios" :loading="loading" dataKey="id" :filterDisplay="showFilters ? 'row' : 'menu'" :sortOrder="filters.sord === 'ASC' ? 1 : -1" :sortField="filters.sidx" showGridlines class="p-datatable-sm">
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
            <Column field="usuario" header="Usuario" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.usuario" type="text" class="p-inputtext-sm" placeholder="Buscar por usuario" maxlength="30" @blur="filters.usuario !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="nombre" header="Nombre" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.nombre" type="text" class="p-inputtext-sm" placeholder="Buscar por nombre" maxlength="30" @blur="filters.nombre !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="apellido" header="Apellido" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.apellido" type="text" class="p-inputtext-sm" placeholder="Buscar apellido" @blur="filters.apellido !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="telefono" header="Teléfono" :showFilterMenu="false">
                <template #filter>
                    <InputText v-if="showFilters" v-model.trim="filters.telefono" type="text" class="p-inputtext-sm" placeholder="Buscar teléfono" @blur="filters.telefono !== null ? onFilterChange() : null" />
                </template>
            </Column>

            <Column field="rol.nombre" header="Rol" :showFilterMenu="false">
                <template #filter>
                    <Select v-if="showFilters" v-model="filters.rolId" :options="roles" optionLabel="nombre" optionValue="id" placeholder="Seleccionar rol" class="p-column-filter w-full" @change="onFilterChange" />
                </template>
            </Column>

            <Column field="sucursal.nombre" header="Sucursal" :showFilterMenu="false">
                <template #filter>
                    <Select v-if="showFilters" v-model="filters.sucursalId" :options="sucursales" optionLabel="nombre" optionValue="id" placeholder="Seleccionar sucursal" class="p-column-filter w-full" @change="onFilterChange" />
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

            <Column header="Acciones" style="min-width: 8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUsuario(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUsuario(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
        <div class="flex justify-center mt-4">
            <PaginatorCommon :filters="filters" :datatable="datatable" @eToPage="onPageChange" @eRefresh="getUsuarios" />
        </div>
    </div>

    <!-- Dialog para crear/editar usuario -->
    <Dialog v-model:visible="usuarioDialog" :style="{ width: '450px' }" :modal="true" header="Usuario">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
                <label for="usuario">Usuario</label>
                <InputText v-model="usuario.usuario" id="usuario" />
            </div>
            <!-- Campo de contraseña solo visible en creación -->
            <div v-if="!usuario.id" class="flex flex-col gap-2">
                <label for="clave" class="required">Contraseña</label>
                <Password v-model="usuario.clave" id="clave" :feedback="false" toggleMask required />
            </div>
            <div class="flex flex-col gap-2">
                <label for="nombre">Nombre</label>
                <InputText v-model="usuario.nombre" id="nombre" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="apellido">Apellido</label>
                <InputText v-model="usuario.apellido" id="apellido" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="telefono">Teléfono</label>
                <InputText v-model="usuario.telefono" id="telefono" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="correo">Correo</label>
                <InputText v-model="usuario.correo" id="correo" type="email" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="rolId">Rol</label>
                <Select v-model="usuario.rolId" :options="roles" optionLabel="nombre" optionValue="id" placeholder="Seleccionar rol" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="sucursalId">Sucursal</label>
                <Select v-model="usuario.sucursalId" :options="sucursales" optionLabel="nombre" optionValue="id" placeholder="Seleccionar sucursal" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="activo">Activo</label>
                <ToggleSwitch v-model="usuario.activo" :default-value="false" />
            </div>
            <div class="flex justify-end gap-2">
                <Button label="Cancelar" class="p-button-text" @click="hideDialog" />
                <Button label="Guardar" @click="saveUsuario" />
            </div>
        </div>
    </Dialog>
    <Dialog v-model:visible="deleteUsuarioDialog" :style="{ width: '450px' }" :modal="true" header="Confirmar">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span>¿Estás seguro de que quieres eliminar el usuario?</span>
        </div>
        <div class="flex justify-end gap-2">
            <Button label="Cancelar" class="p-button-text" @click="deleteUsuarioDialog = false" />
            <Button label="Sí" @click="deleteUsuario()" />
        </div>
    </Dialog>
</template>