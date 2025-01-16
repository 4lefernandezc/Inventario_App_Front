<template>
  <div class="datatable">
    <DataTable
      :dataKey="idkey ?? 'id'"
      :value="rows"
      :paginator="!noLocalPaginator ? true : undefined"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :rowHover="true"
      :loading="loading"
      :filterDisplay="showFilter ? 'row' : undefined"
      v-model:filters="filters"
      :filters="filters"
      :globalFilterFields="globalFilterFields"
      resizableColumns
      showGridlines
      columnResizeMode="expand"
      scrollable
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} al {last} de {totalRecords} registros"
      @cell-edit-complete="onCellEditComplete"
      removableSort
      :selectionMode="singleSelection ? 'single' : undefined"
      v-model:selection="selectedData"
      v-model:editingRows="editingRows"
      :editMode="
        cellsEditable || someCellsEditable.length > 0
          ? 'cell'
          : rowEditable
            ? 'row'
            : undefined
      "
      @row-edit-save="onRowEditSave"
    >
      <template #empty> No se encontraron registros. </template>
      <!-- todo: Style loading -->
      <template #loading><Spinner /></template>
      <!-- ****************************HEADER**************************** -->
      <template v-if="!noHeader" #header>
        <div class="flex justify-between">
          <div class="flex items-end gap-4">
            <span v-if="title" class="font-semibold text-xl">{{ title }}</span>
            <Button
              v-if="multiSelection"
              :disabled="
                !multiSelection || !selectedData || selectedData.length <= 0
              "
              type="button"
              :severity="
                !multiSelection || !selectedData || selectedData.length <= 0
                  ? 'secondary'
                  : 'danger'
              "
              icon="pi pi-trash"
              @click="handleDeleteConfirm()"
            />
            <IconField v-if="globalFilterFields">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputTextComponent
                v-model="filters['global'].value"
                :label="placeholderSearch ?? 'Búsqueda general'"
                placeholder="Buscar..."
              />
            </IconField>
            <Button
              v-if="!noFilters && !activedFilter"
              type="button"
              :icon="showFilter ? 'pi pi-filter-slash' : 'pi pi-filter'"
              label="Filtro"
              :outlined="showFilter ? false : true"
              @click="toggleFilter()"
            />
            <slot name="header-left"></slot>
          </div>
          <div class="flex items-end gap-4">
            <slot name="header-center"></slot>
          </div>
          <div class="flex items-end gap-4">
            <slot name="header-right"></slot>
            <Button
              v-if="!noExportBtn"
              type="button"
              severity="info"
              icon="pi pi-file-export"
              label="Exportar"
              outlined
              @click="openReportModal()"
            />
            <Button
              v-if="!noAddBtn"
              type="button"
              icon="pi pi-plus"
              :label="addBtnLabel ?? 'Nuevo'"
              style="min-width: 10rem"
              @click="onOpenAddModal()"
            />
          </div>
        </div>
      </template>
      <!-- ************************************************* -->

      <!-- **********************COLUMNS********************** -->
      <!-- Seleccion: -->
      <!-- ***Multiple -->
      <Column
        v-if="multiSelection"
        selectionMode="multiple"
        headerStyle="width: 3rem"
      ></Column>
      <!-- ***Simple -->
      <Column
        v-if="singleSelection && selectedData && !noSelectionActionCol"
        header=""
        bodyClass="text-center"
        style="width: 4rem; background-color: initial !important; padding: 0"
        alignFrozen="right"
      >
        <template #body="{ data }">
          <Button
            v-if="data.id === selectedData.id"
            icon="pi pi-angle-double-left"
            text
            aria-label="double-left"
            @click.stop="actionOnSelectedRow()"
          />
        </template>
      </Column>

      <!-- Generación de columnas -->
      <template v-for="(col, index) in columns">
        <!-- Texto -->
        <Column
          :key="col.field"
          v-if="col.type === 'text'"
          :field="col.field"
          :filterField="col.field"
          :header="col.header"
          :style="`min-width: ${col.minWidth ? col.minWidth : 'min-width: 10rem'}; max-width: ${col.maxWidth ? col.maxWidth : ''}`"
          :showFilterMatchModes="false"
          :show-filter-menu="false"
          :frozen="index === 0 && !noFrozenCols ? true : false"
          sortable
        >
          <template v-if="index === 0 && !noFrozenCols" #header>
            <i class="pi pi-thumbtack text-gray-300"></i>
          </template>
          <template
            v-if="
              cellsEditable ||
              someCellsEditable.includes(col.field) ||
              rowEditable
            "
            #editor="{ data, field }"
          >
            <InputText
              v-if="field.split('.').length === 1"
              v-model="data[field]"
              autofocus
              fluid
            />
            <InputText
              v-else-if="field.split('.').length === 2"
              v-model="data[field.split('.')[0]][field.split('.')[1]]"
              autofocus
              fluid
            />
            <InputText
              v-else-if="field.split('.').length === 3"
              v-model="
                data[field.split('.')[0]][field.split('.')[1]][
                  field.split('.')[2]
                ]
              "
              autofocus
              fluid
            />
          </template>
          <template #body="{ data, field }">
            {{ findProp(data, field) }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="Buscar"
            />
          </template>
        </Column>

        <!-- Select -->
        <Column
          :key="col.field"
          v-if="col.type === 'select'"
          :field="col.field"
          :header="col.header"
          :filterField="col.field"
          :showFilterMatchModes="false"
          :style="`min-width: ${col.minWidth ? col.minWidth : 'min-width: 10rem'}; max-width: ${col.maxWidth ? col.maxWidth : ''}`"
          :show-filter-menu="false"
          sortable
          :sort-field="`${col.field}.name`"
        >
          <template
            v-if="
              cellsEditable ||
              someCellsEditable.includes(col.field) ||
              rowEditable
            "
            #editor="{ data, field }"
          >
            <Select
              v-model="data[field]['id']"
              :options="selectOptions[field]"
              optionLabel="name"
              optionValue="id"
              fluid
            >
              <template #option="slotProps">
                {{ slotProps.option.name }}
              </template>
            </Select>
          </template>
          <template #body="{ data, field }">
            {{ data[field].name }}
          </template>
          <template #filter="{ filterModel, filterCallback, field }">
            <MultiSelect
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="selectOptions[field]"
              optionLabel="name"
              placeholder="Buscar opciones"
              style="min-width: 14rem"
              :maxSelectedLabels="1"
            >
              <template #option="slotProps">
                {{ slotProps.option.name }}
              </template>
            </MultiSelect>
          </template>
        </Column>

        <!-- Fecha -->
        <Column
          :key="col.field"
          v-if="col.type === 'date'"
          :header="col.header"
          :field="col.field"
          :filterField="col.field"
          dataType="date"
          :style="`min-width: ${col.minWidth ? col.minWidth : 'min-width: 10rem'}; max-width: ${col.maxWidth ? col.maxWidth : ''}`"
          :showFilterMatchModes="false"
          :show-filter-menu="false"
          sortable
        >
          <template
            v-if="
              cellsEditable ||
              someCellsEditable.includes(col.field) ||
              rowEditable
            "
            #editor="{ data, field }"
          >
            <DatePicker
              v-if="field.split('.').length === 1"
              v-model="data[field]"
              dateFormat="dd/mm/yy"
              placeholder="dd/mm/yyyy"
            />
            <DatePicker
              v-else-if="field.split('.').length === 2"
              v-model="data[field.split('.')[0]][field.split('.')[1]]"
              dateFormat="dd/mm/yy"
              placeholder="dd/mm/yyyy"
            />
            <DatePicker
              v-else-if="field.split('.').length === 3"
              v-model="
                data[field.split('.')[0]][field.split('.')[1]][
                  field.split('.')[2]
                ]
              "
              dateFormat="dd/mm/yy"
              placeholder="dd/mm/yyyy"
            />
          </template>
          <template #body="{ data, field }">
            {{ formatDate(findProp(data, field)) }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <DatePicker
              v-model="filterModel.value"
              @update:modelValue="filterCallback()"
              dateFormat="dd/mm/yy"
              placeholder="dd/mm/yyyy"
            />
          </template>
        </Column>

        <!-- Numerico* -->
        <Column
          :key="col.field"
          v-if="col.type === 'numeric' || col.type === 'currency'"
          :header="col.header"
          :field="col.field"
          :filterField="col.field"
          dataType="numeric"
          :style="`min-width: ${col.minWidth ? col.minWidth : 'min-width: 10rem'}; max-width: ${col.maxWidth ? col.maxWidth : ''}`"
          :filter-match-mode-options="numericMatchModesOptions"
          sortable
        >
          <template
            v-if="
              cellsEditable ||
              someCellsEditable.includes(col.field) ||
              rowEditable
            "
            #editor="{ data, field }"
          >
            <InputNumber
              v-if="field.split('.').length === 1"
              v-model="data[field]"
              showButtons
              :step="col.type === 'currency' ? 0.01 : undefined"
              :minFractionDigits="col.type === 'currency' ? 2 : undefined"
            />
            <InputNumber
              v-else-if="field.split('.').length === 2"
              v-model="data[field.split('.')[0]][field.split('.')[1]]"
              showButtons
              :step="col.type === 'currency' ? 0.01 : undefined"
              :minFractionDigits="col.type === 'currency' ? 2 : undefined"
            />
            <InputNumber
              v-else-if="field.split('.').length === 3"
              v-model="
                data[field.split('.')[0]][field.split('.')[1]][
                  field.split('.')[2]
                ]
              "
              showButtons
              :step="col.type === 'currency' ? 0.01 : undefined"
              :minFractionDigits="col.type === 'currency' ? 2 : undefined"
            />
          </template>
          <template #body="{ data, field }">
            {{
              col.type === "currency"
                ? findProp(data, field) !== null
                  ? formatCurrency(findProp(data, field))
                  : ""
                : findProp(data, field)
            }}
          </template>
          <template #filter="{ filterModel, field }">
            <InputNumber
              v-model="filterModel.value"
              @blur="(e) => filterInputNumberChanges(e, field)"
              placeholder="Buscar"
            />
          </template>
        </Column>

        <!-- Checkbox -->
        <Column
          :key="col.field"
          v-if="col.type === 'binary'"
          :header="col.header"
          :field="col.field"
          :filterField="col.field"
          dataType="boolean"
          bodyClass="text-center"
          :style="`min-width: ${col.minWidth ? col.minWidth : 'min-width: 10rem'}; max-width: ${col.maxWidth ? col.maxWidth : ''}`"
          :showFilterMatchModes="false"
          sortable
        >
          <template
            v-if="
              cellsEditable ||
              someCellsEditable.includes(col.field) ||
              rowEditable
            "
            #editor="{ data, field }"
          >
            <div class="flex items-center gap-2">
              <Checkbox
                v-if="field.split('.').length === 1"
                v-model="data[field]"
                binary
                @change="() => onBinaryChange(data, field)"
              />
              <Checkbox
                v-else-if="field.split('.').length === 2"
                v-model="data[field.split('.')[0]][field.split('.')[1]]"
                binary
              />
              <Checkbox
                v-else-if="field.split('.').length === 3"
                v-model="
                  data[field.split('.')[0]][field.split('.')[1]][
                    field.split('.')[2]
                  ]
                "
                binary
              />
            </div>
          </template>
          <template #body="{ data, field }">
            <i
              class="pi"
              :class="{
                'pi-check-circle text-green-500 ': findProp(data, field),
                'pi-times-circle text-red-500': !findProp(data, field),
              }"
            ></i>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <div class="flex items-center gap-2">
              <Checkbox
                v-model="filterModel.value"
                @change="filterCallback()"
                :indeterminate="filterModel.value === null"
                binary
              />
              <label class="font-bold">
                {{ col.header }}
              </label>
            </div>
          </template>
        </Column>
      </template>
      <slot name="custom-columns"></slot>

      <!-- Columna Actions -->
      <!-- Columna Editar (btn) toda la final -->
      <Column
        v-if="rowEditable"
        :rowEditor="true"
        style="width: 4rem; padding: 0"
        bodyStyle="text-align:center"
        alignFrozen="right"
        :frozen="!noFrozenCols"
      >
      </Column>
      <!-- Título a la Columna de Buttons -->
      <Column
        v-if="!noActions"
        header="Acciones"
        bodyClass="text-center"
        style="width: 4rem"
        alignFrozen="right"
        :frozen="!noFrozenCols"
      >
        <template #body="{ data }">
          <div class="flex justify-center gap-2">
            <slot name="actions" :row="data"></slot>
            <Button
              v-if="detailBtn"
              @click.stop="detailRow(data)"
              icon="pi pi-eye"
              severity="secondary"
              rounded
              outlined
            />
            <Button
              v-if="!noEditBtn"
              @click.stop="openEditModal(data)"
              icon="pi pi-pencil"
              severity="info"
              rounded
              outlined
            />
            <Button
              v-if="!noDeleteBtn"
              @click.stop="openConfirmModal(data)"
              icon="pi pi-trash"
              severity="danger"
              rounded
              outlined
            />
          </div>
        </template>
      </Column>
      <!-- ************************************************* -->

      <!-- ***********************FOOTER******************** -->
      <!-- Pagination -->
      <!-- todo -->

      <!-- Footer Seccion -->
      <template v-if="!noFooter" #footer>
        <slot name="footer"></slot>
      </template>
      <!-- ************************************************** -->
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { findProp, formatCurrency } from "@/util/index";
import { FilterMatchMode } from "@primevue/core/api";
import Swal from "sweetalert2";
import {
  onBeforeMount,
  watchEffect,
  ref,
  watch,
  computed,
  onMounted,
} from "vue";
import InputTextComponent from "@/components/form/InputTextComponent.vue";
import Spinner from "@/components/ui/Spinner.vue";

// Operadores de la el filtro de Columna tipo numérico
const numericMatchModesOptions = [
  { label: "Igual", value: FilterMatchMode.EQUALS },
  { label: "Diferente", value: FilterMatchMode.NOT_EQUALS },
  { label: "Menor a", value: FilterMatchMode.LESS_THAN },
  { label: "Menor o igual a", value: FilterMatchMode.LESS_THAN_OR_EQUAL_TO },
  { label: "Mayor a", value: FilterMatchMode.GREATER_THAN },
  { label: "Mayor o igual a", value: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
];

const {
  rows: propRows, // Filas/Data
  columns: propColumns, // Array para generar las columna => {header: string, field: string, type: "text" | "select" | "date" | "currency" | "numeric" | "binary", mimWidth?: string, maxWidth?: string }[]
  height: propHeight, // Deternina el alto de la tabla

  loading: propLoading, // Boolean
  idkey, // String | Indica que campo va a tomar la tabla como id (ejemplo "userId") por defecto es "id"

  noFrozenCols, // Boolean | Quita el fijado de la primera columna y la columna actions

  // EDICIÓN
  cellsEditable, // Boolean | usar con @onCellEdit | habilita la edición de TODAS las celdas al hacer click
  someCellsEditable, // String[] | usar con @onCellEdit | habilita la edición de las celdas que se envíen al hacer click
  rowEditable, // Boolean | usar con @onRowEditSave | habilita la edición de TODA la fila a la vez

  // SELECCIÓN DE FILAS
  multiSelection, // Boolean | usar con @onSelectedRow | usar con @onDeleteItems | habilita la selección múltiple para eliminar => (Columna checks)
  singleSelection, // Boolean | usar con @onSelectedRow | habilita la selección simple al hacer click en una fila => (Columna con el icon "<<" que es un boton para hacer una acción sobre la fila seleccionada)
  noSelectionActionCol, // Boolean | Si tiene el singleSelection activado, esta propiedad oculta la Columna "<<" y hace la acción direcctamente sobre la fila seleccionada

  // HEADER
  noHeader, // Boolean | Oculta TODO el header (Botones de filtro, reporte, nuevo y el búscador)
  title, // String | Título dentro del header
  noExportBtn, // Boolean | Oculta el botón Exportar
  noFilters, // Boolean | Oculta el botón Filtros (OnClick => Muestra los buscadores de cada columna)
  activedFilter, // Boolean | Muestra automaticamente los buscadores de cada columna
  selectOptions, // Object | Objeto que contiene las opciones de las columnas de tipo "select" para poder seleccionarlas en su filtro (ej. { statuses: [{name: "Activo", id: "1"}, {name: "Inactivo", id: "2"}] }). IMPORTANTE: debe coincidir la key (ej. "statuses") con la propiedad field de su respectiva columna del array columns
  globalFilterFields, // String[] | Si se enviar muestra el buscardor del header. Se debe enviar los fields de cada columna que se quiera incluir en la búsqueda. NOTA: Ejemplo para las columnas de tipo select [...,"status.name",...] (SIEMPRE es .name)
  placeholderSearch, // Label para el globalFilterFields
  noAddBtn, // Boolean | Oculta el botón +Agregar
  addBtnLabel, // String | Label del boton +Agregar

  // ACTIONS
  noEditBtn, // Boolean | Oculta el boton de edición (modal)
  noActions, // Boolean | Oculta toda la Columna Actions (botones)
  noDeleteBtn, // Boolean | Oculta el botón Eliminar
  detailBtn, // Boolean | usar con @onDetailRow | Muestra el botón detail (icon => ojo)

  //FOOTER
  noLocalPaginator, // Boolean | Quita la pagination
  noFooter, // Boolean | Quita el footer
} = defineProps({
  title: {
    type: String,
  },
  someCellsEditable: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  noFooter: {
    type: Boolean,
    default: false,
  },
  idkey: {
    type: String,
  },
  noSelectionActionCol: {
    type: Boolean,
    default: false,
  },
  rowEditable: {
    type: Boolean,
    default: false,
  },
  placeholderSearch: {
    type: String,
  },
  noFrozenCols: {
    type: Boolean,
    default: false,
  },
  noHeader: {
    type: Boolean,
    default: false,
  },
  cellsEditable: {
    type: Boolean,
    default: false,
  },
  multiSelection: {
    type: Boolean,
    default: false,
  },
  detailBtn: {
    type: Boolean,
    default: false,
  },
  noDeleteBtn: {
    type: Boolean,
    default: false,
  },
  noEditBtn: {
    type: Boolean,
    default: false,
  },
  noExportBtn: {
    type: Boolean,
    default: false,
  },
  addBtnLabel: {
    type: String,
  },
  noAddBtn: {
    type: Boolean,
    default: false,
  },
  noFilters: {
    type: Boolean,
    default: false,
  },
  activedFilter: {
    type: Boolean,
    default: false,
  },
  noLocalPaginator: {
    type: Boolean,
    default: false,
  },
  noActions: {
    type: Boolean,
    default: false,
  },
  singleSelection: {
    type: Boolean,
    default: false,
  },
  rows: {
    default: null,
  },
  columns: {
    default: null,
    type: { header: String, field: String, type: String },
  },
  selectOptions: {
    default: null,
  },
  globalFilterFields: {
    default: null,
    type: Array,
  },
  height: {
    default: null, // Si no se proporciona, será null
    type: String, // Tipo número, para valores como 500
  },
});

const emit = defineEmits([
  // Eliminación multiple
  "onDeleteItems",
  "onSelectItems",
  "onBinaryChange",
  // Actions
  "onDetailRow",
  "onOpenAddAction",
  "onOpenAddModal",
  "onOpenEditAction",
  "onDeleteConfirm", // Eliminación simple

  // Edición de celda
  "onCellEdit",
  // Edición de toda la fila
  "onRowEditSave",

  // Acción sobre la fila seleccionada
  "onSelectedRow",
]);
const rows = ref(propRows);
const columns = ref(propColumns);
const selectedData = ref();
const height = ref(propHeight ?? "58vh");
const editingRows = ref([]);
const loading = ref(propLoading);
const showFilter = ref(activedFilter);
const filters = ref(null);

onBeforeMount(() => {
  initFilters();
});
////
import { useRecipeSelectionStore } from "../data/store/selectionProducts.store";
const store = useRecipeSelectionStore();

onMounted(() => {
  // Si el store tiene items seleccionados, los asignamos a selectedData
  // para que el DataTable los muestre como seleccionados.
  if (store.selectedItems.length > 0) {
    selectedData.value = [...store.selectedItems];
  }
});

watch(selectedData, (data) => {
  emit("onSelectItems", data);
  store.setSelectedItems(data);
});
/////

watchEffect(() => {
  rows.value = propRows;
  columns.value = propColumns;
  loading.value = propLoading;

  // Para la acción sobre la columna seleccionada
  if (noSelectionActionCol && selectedData.value !== undefined) {
    if (selectedData.value) {
      actionOnSelectedRow(true);
    } else {
      actionOnSelectedRow(false);
    }
  }
});

//emite un evento al checkbox
function onBinaryChange(rowData: any, field: any) {
  // rowData: objeto de la fila
  // field: el campo (por ej. 'allow') que está cambiando
  // Dispara un evento para que el padre haga la lógica final:
  emit("onBinaryChange", rowData);
}

// Genera el objeto filters para el DataTable de forma dinámica segun los tipos de columnas que hayan
function initFilters() {
  const configFilter = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };

  const textFields = columns.value.filter((obj) => obj.type === "text");
  for (let i = 0; i < textFields.length; i++) {
    configFilter[textFields[i]["field"]] = {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    };
  }

  const selectFields = columns.value.filter((obj) => obj.type === "select");
  for (let i = 0; i < selectFields.length; i++) {
    configFilter[selectFields[i]["field"]] = {
      value: null,
      matchMode: FilterMatchMode.IN,
    };
  }

  const dateFields = columns.value.filter((obj) => obj.type === "date");
  for (let i = 0; i < dateFields.length; i++) {
    configFilter[dateFields[i]["field"]] = {
      value: null,
      matchMode: FilterMatchMode.DATE_IS,
    };
  }

  const numericFields = columns.value.filter(
    (obj) => obj.type === "numeric" || obj.type === "currency"
  );
  for (let i = 0; i < numericFields.length; i++) {
    configFilter[numericFields[i]["field"]] = {
      value: null,
      matchMode: FilterMatchMode.LESS_THAN,
    };
  }

  const binaryFields = columns.value.filter((obj) => obj.type === "binary");
  for (let i = 0; i < binaryFields.length; i++) {
    configFilter[binaryFields[i]["field"]] = {
      value: null,
      matchMode: FilterMatchMode.EQUALS,
    };
  }

  filters.value = configFilter;
}

// Formato fecha DD/MM/AAAA
function formatDate(value) {
  return value.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Action del buton "Filtro" que Muestra/Oculta los filtros de cada columna
function toggleFilter() {
  showFilter.value = !showFilter.value;
  initFilters();
}

// Adaptador para el filtro de tipo currency
function filterInputNumberChanges(event, field) {
  if (event.value) {
    const dollarsAsFloat = parseFloat(event.value.replace(/[^0-9-.]/g, ""));
    filters.value = {
      ...filters.value,
      [field]: {
        ...filters.value[field],
        value: dollarsAsFloat,
      },
    };
  }
}

// Edita la celda y envia la nueva (rows) + la fila editada al event @onCellEdit
function onCellEditComplete(event) {
  // todo: check if has actually changed
  const id = event.data.id;
  const field = event.field;
  const newValue = event.newValue;
  const updatedRows = [...rows.value];
  const editIndex = updatedRows.findIndex((obj) => obj.id === id);
  if (editIndex > -1) {
    updatedRows[editIndex] = {
      ...updatedRows[editIndex],
      [field]:
        typeof newValue === "object" && !!newValue.id
          ? selectOptions[field].find((obj) => obj.id === newValue.id)
          : newValue,
    };
  }
  emit("onCellEdit", updatedRows, updatedRows[editIndex]);
}

function openReportModal() {
  window.alert("Exportar tabla");
}

function onOpenAddModal() {
  emit("onOpenAddModal");
}

function openEditModal(item) {
  emit("onOpenEditAction", item);
}
function openConfirmModal(item) {
  emit("onDeleteConfirm", item);
}
function actionOnSelectedRow(data: boolean | undefined) {
  emit("onSelectedRow", data !== false ? selectedData.value : null);
}
function onRowEditSave(event: any) {
  emit("onRowEditSave", event);
}
function detailRow(item) {
  emit("onDetailRow", item);
}
function handleDeleteConfirm() {
  Swal.fire({
    title: `¿Desea eliminar los registro seleccionados?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#bdbdbd",
    confirmButtonText: "SI ELIMINAR",
    cancelButtonText: "NO ELIMINAR",
  }).then(async (result) => {
    if (result.isConfirmed) {
      emit("onDeleteItems", selectedData.value);
      selectedData.value = undefined;
    }
  });
}
</script>

<style scoped lang="scss">
// todo: Dark mode
:deep(.p-datatable-frozen-column) {
  font-weight: bold;
}
:deep(.p-inputicon) {
  top: 70%;
}
:deep(.p-datatable-row-selected) {
  td {
    font-weight: bold;
    background-color: var(--p-surface-300) !important;
  }
}
:deep(.p-datatable-table-container) {
  border: 1px solid var(--p-datatable-border-color);
  border-top: none;
}
.datatable {
  :deep(.p-datatable-table-container) {
    height: v-bind(height);
  }
}
</style>
