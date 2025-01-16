<template>
  <Drawer
    v-model:visible="visibleFull"
    header="Registrar factura venta"
    position="full"
    v-on:hide="handleClose"
    class="my-drawer"
  >
    <div class="h-[100%] flex flex-col justify-between">
      <div
        :class="
          cn(
            'overflow-hidden max-w-[initial] container flex relative',
            gapStyle
          )
        "
      >
        <!-- MAIN -->
        <div
          :class="
            cn(
              'flex flex-col gap-6 transition-all duration-300 h-[max-content]',
              drawerVisibility ? 'w-[40%]' : 'w-[96%]'
            )
          "
        >
          <!-- General -->
          <div
            class="my-card border border-surface rounded-border pt-5 p-4 relative"
          >
            <div class="card-title text-lg font-semibold">General</div>
            <div class="my-card-content h-[50px] grid grid-cols-12 gap-4 pt-2">
              <FloatLabel
                :class="drawerVisibility ? 'col-span-6' : 'col-span-2'"
                variant="on"
              >
                <InputText
                  id="name"
                  v-model.trim="saleData.nroFactura"
                  fluid
                  disabled
                />
                <label for="name">N° Venta</label>
              </FloatLabel>
              <FloatLabel
                :class="drawerVisibility ? 'col-span-6' : 'col-span-2'"
                variant="on"
              >
                <InputText
                  id="id"
                  v-model.trim="saleData.nroFactura"
                  fluid
                  disabled
                />
                <label for="id">N° Factura</label>
              </FloatLabel>
              <FloatLabel
                :class="drawerVisibility ? 'col-span-6' : 'col-span-2'"
                variant="on"
              >
                <InputText
                  id="asesor"
                  v-model.trim="saleData.created_at"
                  fluid
                  disabled
                />
                <label for="asesor">Fecha y Hora</label>
              </FloatLabel>
              <div
                :class="
                  cn(
                    'flex gap-1',
                    drawerVisibility ? 'col-span-6' : 'col-span-4'
                  )
                "
              >
                <FloatLabel class="flex-1" variant="on">
                  <IconField>
                    <InputText
                      id="asesor"
                      v-model.trim="saleData.client.name"
                      fluid
                    />
                    <label for="asesor">Cliente</label>
                    <InputIcon>
                      <i class="pi pi-search" />
                    </InputIcon>
                  </IconField>
                </FloatLabel>
                <FloatLabel class="flex-[0.3]" variant="on">
                  <InputText
                    id="asesor"
                    v-model.trim="saleData.client.puntos"
                    fluid
                    disabled
                  />
                  <label for="asesor">Pts. acumulados</label>
                </FloatLabel>
              </div>
              <FloatLabel
                :class="drawerVisibility ? 'col-span-6' : 'col-span-2'"
                variant="on"
              >
                <InputText
                  id="asesor"
                  v-model.trim="saleData.client.hojaPrecio"
                  fluid
                />
                <label for="asesor">Hoja de precio</label>
              </FloatLabel>
            </div>
          </div>
          <!-- FACTURACIÓN -->
          <div
            class="my-card border border-surface rounded-border pt-5 p-4 relative"
          >
            <div class="card-title text-lg font-semibold">Facturación</div>
            <div class="my-card-content h-[50px] grid grid-cols-12 gap-4 pt-2">
              <div
                :class="
                  cn(
                    'flex gap-1',
                    drawerVisibility ? 'col-span-6' : 'col-span-3'
                  )
                "
              >
                <FloatLabel class="flex-[0.3]" variant="on">
                  <InputText
                    id="email"
                    v-model.trim="saleData.client.doc_type"
                    fluid
                  />
                  <label for="email">Tipo</label>
                </FloatLabel>
                <FloatLabel class="flex-1" variant="on">
                  <InputText
                    id="phone"
                    v-model.trim="saleData.client.name"
                    fluid
                  />
                  <label for="phone">N° Documento</label>
                </FloatLabel>
              </div>
              <FloatLabel
                :class="drawerVisibility ? 'col-span-6' : 'col-span-4'"
                variant="on"
              >
                <InputText
                  id="phone"
                  v-model.trim="saleData.client.razon"
                  fluid
                />
                <label for="phone">Razón social</label>
              </FloatLabel>
              <FloatLabel
                :class="drawerVisibility ? 'col-span-6' : 'col-span-3'"
                variant="on"
              >
                <InputText
                  id="phone"
                  v-model.trim="saleData.client.email"
                  fluid
                />
                <label for="phone">Correo electrónico</label>
              </FloatLabel>
              <FloatLabel
                :class="drawerVisibility ? 'col-span-6' : 'col-span-2'"
                variant="on"
              >
                <IconField>
                  <InputText
                    id="phone"
                    v-model.trim="saleData.client.phone"
                    fluid
                  />
                  <label for="phone">N° Whatsapp/Teléfono</label>
                  <InputIcon>
                    <i class="pi pi-whatsapp" />
                  </InputIcon>
                </IconField>
              </FloatLabel>
            </div>
          </div>

          <!-- TABLE -->
          <DataGrid
            :rows="saleProducts"
            :columns="saleColumns"
            title="Detalle de venta"
            :someCellsEditable="['quantity']"
            noExportBtn
            noHeader
            noFilters
            noEditBtn
            noLocalPaginator
            noAddBtn
            @onCellEdit="handleOnCellEdit"
            @onOpenAddAction="onShowDrawer"
            @onDeleteConfirm="handleAcceptDeleteConfirm"
            maxHeight="30vh"
          />
          <div
            :class="
              cn(
                'flex justify-between',
                drawerVisibility
                  ? 'flex-col flex-col-reverse gap-4 overflow-auto'
                  : '',
                saleProducts.length === 0
                  ? 'h-[40vh]'
                  : saleProducts.length === 1
                    ? 'h-[35vh]'
                    : saleProducts.length === 2
                      ? 'h-[30vh]'
                      : saleProducts.length === 3
                        ? 'h-[25vh]'
                        : 'h-[20vh]'
              )
            "
          >
            <FloatLabel
              :class="drawerVisibility ? 'w-[100%]' : 'w-[40%]'"
              variant="on"
            >
              <Textarea class="w-full" :autoResize="true" rows="6" />
              <label for="phone">Comentario</label>
            </FloatLabel>
            <div
              :class="
                cn(
                  'my-card border border-surface rounded-border pt-5 p-4 relative',
                  drawerVisibility ? 'w-[100%]' : 'w-[45%]'
                )
              "
            >
              <div class="card-title text-lg font-semibold">Importe</div>
              <div class="flex flex-col gap-3">
                <div class="w-full flex gap-4 justify-end">
                  <span class="font-semibold text-lg">Subtotal:</span>
                  <InputText
                    type="number"
                    v-model="saleData.total"
                    style="width: 8rem"
                  />
                </div>
                <hr />
                <div class="w-full flex justify-between">
                  <div class="flex gap-4">
                    <span class="font-semibold text-lg">Descuento:</span>

                    <IconField>
                      <InputText
                        type="number"
                        v-model="saleData.total"
                        style="width: 8rem"
                      />
                      <InputIcon>
                        <i class="pi pi-percentage" />
                      </InputIcon>
                    </IconField>
                  </div>
                  <div class="flex gap-4">
                    <span class="font-semibold text-lg">Monto:</span>
                    <InputText
                      type="number"
                      v-model="saleData.total"
                      style="width: 8rem"
                    />
                  </div>
                </div>
                <hr />
                <div class="w-full flex gap-4 justify-end">
                  <span class="font-semibold text-lg">Monto total:</span>
                  <InputText
                    type="number"
                    v-model="saleData.total"
                    style="width: 8rem"
                  />
                </div>
                <hr />
                <div class="w-full flex justify-between">
                  <div class="flex gap-4">
                    <span class="font-semibold text-lg">Transacción:</span>
                    <InputText
                      type="number"
                      v-model="saleData.total"
                      style="width: 8rem"
                    />
                  </div>
                  <div class="flex gap-4">
                    <span class="font-semibold text-lg">Monto Recibido:</span>
                    <InputText
                      type="number"
                      v-model="saleData.total"
                      style="width: 8rem"
                    />
                  </div>
                </div>
                <hr />
                <div class="w-full flex gap-4 justify-end">
                  <span class="font-semibold text-lg">Monto de cambio:</span>
                  <InputText
                    type="number"
                    v-model="saleData.total"
                    style="width: 8rem"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- DRAWER -->
        <div
          :class="
            cn(
              'h-[max-content] max-h-[75vh] flex flex-col gap-6 justify-between transition-all duration-300',
              drawerVisibility
                ? 'w-[55%] border border-surface rounded-border p-4'
                : 'w-0 overflow-hidden px-0'
            )
          "
        >
          <!-- HEADER -->
          <div class="flex justify-between items-start">
            <div class="flex gap-4 items-center">
              <span
                @click="onGotoMain()"
                class="cursor-pointer font-semibold text-2xl whitespace-nowrap"
                >Agregar Productos</span
              >
              <i
                v-if="detailsVisibility && detailItem.name"
                class="pi pi-angle-right"
              />
              <span
                v-if="detailsVisibility && detailItem.name"
                class="text-xl whitespace-nowrap text-gray-600"
                >{{ detailItem.name }}</span
              >
            </div>
            <Button
              icon="pi pi-times"
              rounded
              text
              severity="secondary"
              aria-label="double-left"
              @click="onHideDrawer()"
            />
          </div>
          <!-- CONTENT -->
          <div class="content flex flex-col gap-4">
            <!-- table -->
            <div v-if="!detailsVisibility" class="flex flex-col gap-2">
              <Toolbar>
                <template #start>
                  <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-8">
                      <i class="pl-2 pi pi-filter text-gray-400" />
                      <div class="flex items-center flex-wrap">
                        <Checkbox
                          id="checkOption1"
                          name="option"
                          value="Chicago"
                          v-model="checkboxValue"
                        />
                        <label for="checkOption1" class="ml-2">Filtro 1</label>
                      </div>
                      <div class="flex items-center">
                        <Checkbox
                          id="checkOption2"
                          name="option"
                          value="Los Angeles"
                          v-model="checkboxValue"
                        />
                        <label for="checkOption2" class="ml-2">Filtro 2</label>
                      </div>
                      <div class="flex items-center">
                        <Checkbox
                          id="checkOption3"
                          name="option"
                          value="New York"
                          v-model="checkboxValue"
                        />
                        <label for="checkOption3" class="ml-2">Filtro 3</label>
                      </div>
                    </div>
                  </div>
                </template>
              </Toolbar>
              <DataGrid
                title="Lista de productos"
                :rows="products"
                :columns="productColumns"
                @onOpenAddAction="handleOpenAddModal"
                @onSelectedRow="handleSelectedRow"
                @onDetailRow="handleDetailRow"
                singleSelection
                detailBtn
                noDeleteBtn
                noEditBtn
                noExportBtn
                activedFilter
                maxHeight="35vh"
              />
              <FormRegisterModal
                :item="{}"
                title="Nuevo producto"
                :visible="addModalVisibility"
                @onCloseModal="handleCloseAddModal"
                @OnAcceptModal="handleAddItem"
              />
            </div>
            <!-- Details -->
            <!-- todo: position absolute (table opacity 0) preservar filtros -->
            <div v-else>
              <div
                class="flex flex-col gap-4 border border-surface-200 dark:border-surface-700 rounded p-4"
              >
                <div class="flex gap-2">
                  <span class="font-semibold">Código:</span>
                  <span>{{ detailItem.code }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="font-semibold">Nombre:</span>
                  <span>{{ detailItem.name }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="font-semibold">Concentración:</span>
                  <span>{{ detailItem.concentration }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="font-semibold">Laboratorio:</span>
                  <span>{{ detailItem.lab }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="font-semibold">Precio:</span>
                  <span>{{ formatCurrency(detailItem.price) }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="font-semibold">Stock:</span>
                  <span>{{ detailItem.stock }}</span>
                </div>
              </div>
            </div>
            <Button
              v-if="detailsVisibility"
              @click="onGotoMain()"
              icon="pi pi-arrow-left"
              severity="secondary"
              label="Volver"
              outlined
              style="width: 10rem"
            />
          </div>
        </div>
        <div class="tab">
          <Button
            type="button"
            icon="pi pi-box"
            severity="info"
            label="Productos"
            style="width: 160px"
            :outlined="!drawerVisibility ? true : false"
            @click="onShowDrawer()"
          />
        </div>
      </div>
      <div class="footer flex items-end mr-16">
        <div class="w-full flex justify-between items-center">
          <div class="flex gap-4 items-center">
            <Button
              icon="pi pi-plus"
              label="Nuevo"
              class="mr-2"
              severity="secondary"
              text
            />
            <Button
              icon="pi pi-times"
              label="Anular"
              class="mr-2"
              severity="secondary"
              text
            />
          </div>
          <Button
            type="button"
            icon="pi pi-save"
            label="Registrar Venta"
            style="width: 15rem; height: 3.2rem"
          />
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
import DataGrid from "@/components/DataGrid.vue";
import { cn, formatCurrency } from "@/util/index";
import FormRegisterModal from "../../table-demo/components/FormRegisterModal.vue";

const { visible: propVisible } = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const addModalVisibility = ref(false);
const detailsVisibility = ref(false);
const visibleFull = ref(false);
const checkboxValue = ref([]);
const detailItem = ref({});
const saleData = reactive({
  id: "1",
  nroFactura: "125",
  created_at: "29/10/2024 16:20:09",
  total: "0",
  client: {
    doc: "416941646946",
    doc_type: "NIT",
    name: "Juan Perez Cruz",
    razon: "Juan Perez Cruz",
    email: "test@test.com",
    phone: "72549633",
    hojaPrecio: "Precio por mayor",
    puntos: "6",
  },
});
const drawerVisibility = ref(false);
const saleProducts = ref([]);
const products = ref([
  {
    id: 1,
    code: "6354",
    name: "Product 1",
    concentration: "22 ml",
    lab: "SEA",
    price: 230,
    stock: 26,
  },
  {
    id: 2,
    code: "5666",
    name: "Product 2",
    concentration: "23 ml",
    lab: "SEA",
    price: 35,
    stock: 11,
  },
  {
    id: 3,
    code: "1966",
    name: "Product 3",
    concentration: "23 ml",
    lab: "SEA",
    price: 6,
    stock: 200,
  },
  {
    id: 4,
    code: "65299",
    name: "Product 4",
    concentration: "44 ml",
    lab: "SEA",
    price: 16,
    stock: 88,
  },
  {
    id: 5,
    code: "65299",
    name: "Product 4",
    concentration: "44 ml",
    lab: "SEA",
    price: 16,
    stock: 88,
  },
  {
    id: 6,
    code: "65299",
    name: "Product 4",
    concentration: "44 ml",
    lab: "SEA",
    price: 16,
    stock: 88,
  },
  {
    id: 7,
    code: "65299",
    name: "Product 4",
    concentration: "44 ml",
    lab: "SEA",
    price: 16,
    stock: 88,
  },
  {
    id: 8,
    code: "65299",
    name: "Product 4",
    concentration: "44 ml",
    lab: "SEA",
    price: 16,
    stock: 88,
  },
]);
const saleColumns = [
  { header: "Código", field: "code", type: "text" },
  { header: "Descripción", field: "name", type: "text" },
  { header: "Cantidad", field: "quantity", type: "numeric" },
  { header: "P/U", field: "price", type: "currency" },
  { header: "Sub total", field: "subTotal", type: "currency" },
];
const productColumns = [
  { header: "Código", field: "code", type: "text" },
  { header: "Descripción", field: "name", type: "text" },
  { header: "Concentración", field: "concentration", type: "text" },
  { header: "Laboratorio", field: "lab", type: "text" },
  { header: "Precio", field: "price", type: "currency" },
  { header: "Stock", field: "stock", type: "numeric" },
];
const gapStyle = ref("gap-0");
const emit = defineEmits(["onCloseModal", "OnAcceptModal"]);

watchEffect(() => {
  visibleFull.value = propVisible;
});

function onHideDrawer() {
  drawerVisibility.value = false;
  setTimeout(() => {
    gapStyle.value = "gap-0";
  }, 300);
}

function onShowDrawer() {
  drawerVisibility.value = !drawerVisibility.value;
  gapStyle.value = "gap-4";
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

function handleDetailRow(item) {
  detailItem.value = item;
  detailsVisibility.value = true;
}

function onGotoMain() {
  detailsVisibility.value = false;
}

function handleSelectedRow(selectedRow) {
  console.log("Action on select row", selectedRow);
  const newSaleProducts = [...saleProducts.value];
  newSaleProducts.push({
    id: newSaleProducts.length + 1,
    code: selectedRow.code,
    name: selectedRow.name,
    quantity: 1,
    price: selectedRow.price,
    subTotal: selectedRow.price,
  });

  saleProducts.value = newSaleProducts;
}

function handleOnCellEdit(updatedRows, editedItem) {
  console.log('dd',editedItem);
  saleProducts.value = updatedRows;
  // todo: recalculate subtotal
}

function handleAcceptDeleteConfirm(item) {
  console.log("Delete", item);
  const newSaleProducts = saleProducts.value.filter(
    (obj) => obj.id !== item.id
  );

  saleProducts.value = newSaleProducts;
}

function handleClose() {
  emit("onCloseModal");
}

function handleAccept() {
  emit("OnAcceptModal");
}
</script>

<style scoped lang="scss">
.p-drawer-content {
  overflow: hidden;
}
.my-card-content {
  overflow-y: auto;
  overflow-x: hidden;
}
.my-card {
  background-color: var(--p-surface-100);
}
.card-title {
  position: absolute;
  top: -15px;
  left: 20px;
  background-color: white;
  padding: 0px 10px;
  border-radius: 8px;
}
.container {
  padding-top: 10px;
  height: 80vh;
  overflow-y: auto;
  padding-bottom: 10px;
}
.tab {
  background-color: white;
  position: absolute;
  top: 71px;
  right: -60px;
  transform: rotate(90deg);
}
.footer {
  border-top: 1px solid var(--p-surface-200);
  height: 10vh;
}
</style>
