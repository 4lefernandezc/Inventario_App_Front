import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import type { TRecipe } from "../types/recipe.types";

export const useRecipeSelectionStore = defineStore("RecipeSelection", () => {
  // ----------------------
  // STATE
  // ----------------------
  const selectedRecipe  = ref<TRecipe>({
    id: null,
    productName: "",
    idproduct: null,
    unitName: "",
    dateCreate: "",
    recycleBin: false,
    iduser: 0,
    idstatus: null,
    idstore: 14,
    comment: "",
    product: null,
    recipeProduct: [],
  });

  const errorMessages = reactive({
    productName: "",
    recipeProduct: "",
    status: "",
  });

  // Este array se usa para guardar ingredientes seleccionados.
  const selectedItems = ref<any[]>([]);

  // ----------------------
  // ACTIONS (métodos)
  // ----------------------
  function setSelectedRecipe(data: TRecipe) {
    selectedRecipe .value = data;
  }

  function setSelectedProductId(id: number) {
    selectedRecipe .value.idproduct = id;
  }

  function setSelectedProductName(name: string) {
    selectedRecipe .value.productName = name;
  }

  function setSelectedUnitName(unityName: string) {
    selectedRecipe .value.unitName = unityName;
  }

  function setSelectedStoreId(id: number) {
    selectedRecipe .value.idstore = id;
  }

  function setSelectedItems(items: any[]) {
    selectedItems.value = items;
  }

  function clearSelectedRecipe() {
    selectedRecipe .value = {
      id: null,
      productName: "",
      idproduct: null,
      unitName: "",
      dateCreate: "",
      recycleBin: false,
      iduser: 0,
      idstatus: null,
      idstore: 0,
      comment: "",
      product: null,
      recipeProduct: [],
    };
    clearErrors();
    selectedItems.value = [];
  }

  function addSelectedIngredient(ingredient: any) {
    const index = selectedRecipe .value.recipeProduct.findIndex(
      (ing) => ing.idproduct === ingredient.idproduct
    );
    if (index !== -1) {
      selectedRecipe .value.recipeProduct[index].quantity = ingredient.quantity;
    } else {
      selectedRecipe .value.recipeProduct.push(ingredient);
    }
  }

  function removeSelectedIngredient(idproduct: number) {
    selectedRecipe .value.recipeProduct =
      selectedRecipe .value.recipeProduct.filter(
        (ing) => ing.idproduct !== idproduct
      );
  }

  function clearErrors() {
    errorMessages.productName = "";
    errorMessages.recipeProduct = "";
    errorMessages.status = "";
  }

  // ----------------------
  // RETURN
  // ----------------------
  return {
    // state
    selectedRecipe ,
    errorMessages,
    selectedItems,
    // actions
    setSelectedRecipe,
    setSelectedProductId,
    setSelectedProductName,
    setSelectedUnitName,
    setSelectedStoreId,
    setSelectedItems,
    clearSelectedRecipe,
    addSelectedIngredient,
    removeSelectedIngredient,
    clearErrors,
  };
});
