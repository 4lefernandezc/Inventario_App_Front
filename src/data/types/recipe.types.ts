// recipe.types.ts
import type { TProductResponse, TProduct } from "../../products/types/index";

export type TRecipeResponse = {
  id: number;
  dateCreate: string;
  recycleBin: boolean;
  iduser: number;
  idstatus: number;
  idstore: number;
  comment: string;
  idproduct: number;
  recipeProduct: IRecipeProduct[];
  product: TProductResponse;
};

export interface IRecipeProductResponse {
  id: number;
  dateCreate: string;
  recycleBin: boolean;
  iduser: number;
  quantity: number;
  idproduct: number;
  idrecipe: number;
  product: TProductResponse;
}

export type TRecipe = {
  id: number | null;
  productName: string | null; 
  unitName: string | null;    
  dateCreate: string;
  recycleBin: boolean;
  iduser: number;
  idstatus: number | null;
  idstore: number;
  comment: string;
  idproduct: number | null;
   // ⚠️ Ahora recipeProduct puede ser array de IRecipeProduct o IRecipeProductDraft
  recipeProduct: IRecipeProductUnion[];
  product: TProduct | null;
};

export interface IRecipeProduct {
  id: number;
  dateCreate: string;
  recycleBin: boolean;
  iduser: number;
  quantity: number;
  idproduct: number;
  idrecipe: number;
  product: TProduct;
}

export interface IRecipeProductDraft {
  id: number;             
  idproduct: number;       
  quantity: number;        
  code?: string;           
  productName?: string;  
  unitName?: string;       
}
// Unión de tipos para permitir ambos en el array
export type IRecipeProductUnion = IRecipeProduct | IRecipeProductDraft;
export type TRecipeRequest = {
  idstore: number;
  idproduct: number;
  comment: string;
  products: TproductRquest[];
};

export type TproductRquest = {
  id: number;
  idproduct: number;
  quantity: number;
};
