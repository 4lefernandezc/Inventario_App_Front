<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Table CRUD</div>
    <DataGrid
      :rows="workers"
      :loading="loading"
      :columns="columns"
      :selectOptions="selectOptions"
      :globalFilterFields="['name', 'representative.name', 'balance']"
      @onCellEdit="handleOnCellEdit"
      @onOpenAddAction="handleOpenAddModal"
      @onOpenEditAction="handleOpenEditModal"
      @onDeleteConfirm="handleDeleteConfirm"
      @onDeleteItems="handleDeleteItems"
      cellsEditable
      multiSelection
      
    >
      <!-- HEADER -->
      <template #header-left>
        <span>Left</span>
      </template>
      <template #header-center>
        <span>Center</span>
      </template>
      <template #header-right>
        <span>Right</span>
      </template>

      <!-- COLUMNS -->
      <template #custom-columns>
        <!-- IMPORTANTE: Si el Datagrid tiene filtros individuales no olvidarse colocar tambien el las columnas custom -->
        <!-- <Column
          field="status"
          header="Status"
          :showFilterMenu="false"
          style="min-width: 12rem"
        >
          <template #body="{ data }">
            <Tag :value="data.status" :severity="getSeverity(data.status)" />
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Select
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="statuses"
              placeholder="Select One"
              style="min-width: 12rem"
              :showClear="true"
            >
              <template #option="slotProps">
                <Tag
                  :value="slotProps.option"
                  :severity="getSeverity(slotProps.option)"
                />
              </template>
            </Select>
          </template>
        </Column>
        <Column
          field="activity"
          header="Activity"
          :showFilterMatchModes="false"
          style="min-width: 12rem"
        >
          <template #body="{ data }">
            <ProgressBar
              :value="data.activity"
              :showValue="false"
              style="height: 6px"
            ></ProgressBar>
          </template>
          <template #filter="{ filterModel }">
            <Slider v-model="filterModel.value" range class="m-4"></Slider>
            <div class="flex items-center justify-between px-2">
              <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
              <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
            </div>
          </template>
        </Column> -->
      </template>

      <!-- ACTIONS -->
      <template #actions>
        <Button
          @click.stop="() => {}"
          icon="pi pi-whatsapp"
          severity="success"
          rounded
          outlined
        />
      </template>

      <!-- FOOTER -->
      <template #footer>
        <span>My custom footer</span>
      </template>
    </DataGrid>
    <FormRegisterModal
      :item="{}"
      title="Add item"
      :visible="addModalVisibility"
      @onCloseModal="handleCloseAddModal"
      @OnAcceptModal="handleAddItem"
    />
    <FormRegisterModal
      :item="itemEdit"
      title="Edit item"
      :visible="editModalVisibility"
      @onCloseModal="handleCloseEditModal"
      @OnAcceptModal="handleEditItem"
    />
  </div>

  <div class="card">
    <div class="font-semibold text-xl mb-4">Table information</div>
    <DataGrid
      :rows="workers"
      :loading="loading"
      :columns="columns"
      :selectOptions="selectOptions"
      :globalFilterFields="['name', 'representative.name', 'balance']"
      @onSelectedRow="handleSelectedRow"
      singleSelection
      noActions
      noExportBtn
      noAddBtn
    />
  </div>
</template>

<script setup lang="ts">
import DataGrid from "@/components/DataGrid.vue";
import { onBeforeMount, reactive, ref } from "vue";
import FormRegisterModal from "../components/FormRegisterModal.vue";
import DeleteRegisterContentModal from "../components/DeleteRegisterContentModal.vue";
import { CustomerService } from "../services/customer.service";

const itemDelete = ref({});
const itemEdit = ref({});
const addModalVisibility = ref(false);
const editModalVisibility = ref(false);
const deleteConfirmVisibility = ref(false);
const workers = ref(null);
const loading = ref(false);
const columns = [
  {
    header: "Nombre",
    field: "name",
    type: "text",
    minWidth: "12rem",
    maxWidth: "16rem",
  },
  {
    header: "País",
    field: "country.code",
    type: "text",
    minWidth: "12rem",
    maxWidth: "16rem",
  },
  {
    header: "Agente",
    field: "representative", // ERROR => representative.name
    // IMPORTANTE: las columnas de tipo select siempre deben tener esta estructura {id: "", name: ""}, asi como sus opciones [{id: "", name: ""}, ...] para que puedan visualizarse y funcione el filtro
    type: "select",
    minWidth: "10rem",
  },
  { header: "Fecha de ingreso", field: "date", type: "date" },
  { header: "Sueldo", field: "balance", type: "currency" },
  {
    header: "Días de trabajo",
    field: "activity",
    type: "numeric",
  },
  { header: "Verificado", field: "verified", type: "binary" },
];
const selectOptions = reactive({ representative: [] });

onBeforeMount(() => {
  loading.value = true;
  // CALL API GET
  CustomerService.getCustomersLarge().then((data) => {
    workers.value = data;
    loading.value = false;
    workers.value.forEach(
      (customer) => (customer.date = new Date(customer.date))
    );
  });
  selectOptions.representative = [
    { name: "Amy Elsner", id: "amyelsner.png" },
    { name: "Anna Fali", id: "annafali.png" },
    { name: "Asiya Javayant", id: "asiyajavayant.png" },
    { name: "Bernardo Dominic", id: "bernardodominic.png" },
    { name: "Elwin Sharvill", id: "elwinsharvill.png" },
    { name: "Ioni Bowcher", id: "ionibowcher.png" },
    { name: "Ivan Magalhaes", id: "ivanmagalhaes.png" },
    { name: "Onyama Limba", id: "onyamalimba.png" },
    { name: "Stephen Shaw", id: "stephenshaw.png" },
    { name: "XuXue Feng", id: "xuxuefeng.png" },
  ];
});

function handleOnCellEdit(updatedRows, editedItem) {
  // CALL API PUT
  console.log(editedItem);
  workers.value = updatedRows;
}

// NEW
function handleOpenAddModal() {
  addModalVisibility.value = true;
}
function handleCloseAddModal() {
  addModalVisibility.value = false;
}
function handleAddItem(values) {
  console.log("Save", values);
  handleCloseAddModal();
}

// EDIT
function handleOpenEditModal(item) {
  editModalVisibility.value = true;
  itemEdit.value = item;
}
function handleCloseEditModal() {
  editModalVisibility.value = false;
}
function handleEditItem(values) {
  console.log("Edit", values);
  handleCloseEditModal();
}

// Single DELETE
function handleDeleteConfirm(item) {
  deleteConfirmVisibility.value = true;
  itemDelete.value = item;
}
function handleCloseDeleteConfirm() {
  deleteConfirmVisibility.value = false;
}
function handleAcceptDeleteConfirm() {
  console.log("Delete", itemDelete.value);
  // CALL API DELETE
  handleCloseDeleteConfirm();
}

// Multi DELETE
function handleDeleteItems(itemsDelete) {
  console.log("Delete Items", itemsDelete);
  // CALL APIS DELETE
}

function handleSelectedRow(selectedRow) {
  console.log("Action on select row", selectedRow);
}

const getSeverity = (status) => {
  switch (status) {
    case "unqualified":
      return "danger";

    case "qualified":
      return "success";

    case "new":
      return "info";

    case "negotiation":
      return "warn";

    case "renewal":
      return null;
  }
};

// const dataTable = [
//   {
//     id: 1492,
//     name: "XXXXXXXXX",
//     productoEquivalenteSIAT: {
//       description: "Onyama Limba",
//       idProduct: "1",
//     },
//   },
// ];

// const columns = [
//   {
//     header: "Agente",
//     field: "productoEquivalenteSIAT",
//     type: "select",
//     minWidth: "10rem",
//   },
// ];
// const productsAdapter = (data) => {
//   return data.map((obj) => {
//     return {
//       ...obj,
//       productoEquivalenteSIAT: {
//         id: obj.idProduct,
//         name: obj.description,
//       },
//     };
//   });
// };

// const productoEquivalenteSIATOptions = [
//   {
//     description: "Onyama Limba",
//     idProduct: "1",
//   },
//   {
//     description: "asdasd qweqwe",
//     idProduct: "2",
//   },
// ];
// const productsSIATOptionsAdapter = (data) => {
//   return data.map((obj) => ({
//     id: obj.idProduct,
//     name: obj.description,
//   }));
// };

// // -------------------------
// const rows = productsAdapter(dataTable);
// _selectOptions.productoEquivalenteSIAT = productsSIATOptionsAdapter(
//   productoEquivalenteSIATOptions
// );
</script>
