<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Tabla Ventas</div>
    <DataGrid
      :rows="workers"
      :loading="loading"
      :columns="columns"
      :globalFilterFields="[]"
      @onOpenAddModal="handleOpenAddModal"
      @onDeleteConfirm="handleDeleteConfirm"
      @onDeleteItems="handleDeleteItems"
      detailBtn
      noEditBtn
      addBtnLabel="Agregar"
    />
    <MockupVentaModal
      :visible="modalVisibility"
      @onCloseModal="handleCloseAddModal"
      @OnAcceptModal="handleSaveItem"
    />
  </div>
</template>

<script setup lang="ts">
import DataGrid from "@/components/DataGrid.vue";
import { onBeforeMount, ref } from "vue";
import MockupVentaModal from "../components/MockupVentaModal.vue";

const itemDelete = ref({});
const modalVisibility = ref(false);
const workers = ref(null);
const loading = ref(false);
const columns = [
  { header: "N° Venta", field: "sale", type: "text" }, // Todo: prop width col, elipsis long text
  { header: "N° Factura", field: "invoice", type: "text" },
  { header: "Tipo cobro", field: "payment", type: "text" },
  { header: "Transacción", field: "transaction", type: "text" },
  { header: "Fecha y Hora", field: "date", type: "date" },
  { header: "Cliente", field: "client", type: "text" },
  { header: "Estado", field: "status", type: "text" },
  { header: "Entrega", field: "deliveried", type: "text" },
  { header: "Emisión", field: "emit", type: "text" },
  { header: "Monto total", field: "total", type: "currency" },
];

onBeforeMount(() => {
  workers.value = [
    {
      id: 1,
      sale: "1",
      invoice: "1614651",
      payment: "Contado",
      transaction: "Efectivo",
      date: new Date("2018-06-11"),
      client: "Juan Perez Cruz",
      status: "Procesando",
      deliveried: "Entregado",
      emit: "En linea",
      total: 1215,
    },
  ];
});

// NEW
function handleOpenAddModal() {
  modalVisibility.value = true;
}
function handleCloseAddModal() {
  modalVisibility.value = false;
}
function handleSaveItem(values) {
  console.log("Save", values);
  handleCloseAddModal();
}

// Single DELETE
function handleDeleteConfirm(item) {
  itemDelete.value = item;
}
function handleCloseDeleteConfirm() {}
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
</script>
