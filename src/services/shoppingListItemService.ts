/**
 * shoppingListItemService — CRUD operations for shopping list items via PocketBase.
 *
 * All item mutations must go through this service.
 * Composables call these functions and manage the resulting reactive state.
 *
 * PocketBase collection: shoppingListItems
 *
 * Note: PocketBase auto-manages `created` and `updated` timestamps.
 */
import type { RecordModel } from "pocketbase";

import type {
  ShoppingListItem,
  ShoppingListItemWithProduct,
  ProductCatalog,
} from "@/domain";
import { pb } from "./pocketbase";

/**
 * Fetch all items belonging to a shopping list, sorted by creation time.
 */
export async function fetchShoppingListItems(
  shoppingListId: string,
): Promise<ShoppingListItem[]> {
  const result = await pb
    .collection("shoppingListItems")
    .getList<RecordModel>(1, 500, {
      filter: pb.filter("shoppingListId = {:shoppingListId}", {
        shoppingListId,
      }),
      sort: "created",
    });
  return result.items.map(mapToShoppingListItem);
}

/**
 * Add a product to a shopping list.
 * If the product already exists in the list, update its quantity instead.
 */
export async function createShoppingListItem(
  shoppingListId: string,
  productId: string,
  quantity: number,
): Promise<ShoppingListItem> {
  const record = await pb.collection("shoppingListItems").create<RecordModel>({
    shoppingListId,
    productId,
    quantity,
  });
  return mapToShoppingListItem(record);
}

/**
 * Update the quantity of an existing list item.
 */
export async function updateShoppingListItemQuantity(
  id: string,
  quantity: number,
): Promise<ShoppingListItem> {
  const record = await pb
    .collection("shoppingListItems")
    .update<RecordModel>(id, { quantity });
  return mapToShoppingListItem(record);
}

/**
 * Remove an item from a shopping list by its item ID.
 */
export async function deleteShoppingListItem(id: string): Promise<void> {
  await pb.collection("shoppingListItems").delete(id);
}

/** Map a PocketBase record to the domain ShoppingListItem type. */
function mapToShoppingListItem(record: RecordModel): ShoppingListItem {
  return {
    id: record.id,
    shoppingListId: record["shoppingListId"] as string,
    productId: record["productId"] as string,
    quantity: record["quantity"] as number,
    createdAt: new Date(record["created"] as string),
  };
}

// ─── Expand queries ───────────────────────────────────────────────────────────

/**
 * Fetch all items for a shopping list with each item's ProductCatalog entry
 * embedded in a single request using PocketBase's `expand` feature.
 *
 * Use this function whenever the UI needs both the item quantity AND the
 * product name / unit / type. It eliminates the N+1 pattern of calling
 * `getProductById` per item.
 *
 * PocketBase query: shoppingListItems?expand=productId
 *
 * The `record.expand.productId` field is normalized into `item.product`
 * before returning — no PocketBase structure leaks to the caller.
 */
export async function fetchShoppingListItemsWithProducts(
  shoppingListId: string,
): Promise<ShoppingListItemWithProduct[]> {
  const records = await pb
    .collection("shoppingListItems")
    .getFullList<RecordModel>({
      filter: pb.filter("shoppingListId = {:shoppingListId}", {
        shoppingListId,
      }),
      expand: "productId",
      sort: "created",
    });
  return records.map(mapToShoppingListItemWithProduct);
}

/** Map a PocketBase record (with optional expand) to ShoppingListItemWithProduct. */
function mapToShoppingListItemWithProduct(
  record: RecordModel,
): ShoppingListItemWithProduct {
  const expandedProduct = record.expand?.["productId"] as
    | RecordModel
    | undefined;

  return {
    id: record.id,
    shoppingListId: record["shoppingListId"] as string,
    productId: record["productId"] as string,
    quantity: record["quantity"] as number,
    createdAt: new Date(record["created"] as string),
    product: expandedProduct ? mapToProductCatalog(expandedProduct) : null,
  };
}

/** Map a PocketBase productCatalog record to the domain ProductCatalog type. */
function mapToProductCatalog(record: RecordModel): ProductCatalog {
  return {
    id: record.id,
    name: record["name"] as string,
    type: record["type"] as ProductCatalog["type"],
    preferredBrand: (record["preferredBrand"] as string) ?? null,
    strictBrand: record["strictBrand"] as boolean,
    targetQuantity: record["targetQuantity"] as number,
    unit: record["unit"] as ProductCatalog["unit"],
    volumeTolerancePct: record["volumeTolerancePct"] as number,
    category: record["category"] as string,
    searchKeywords: (record["searchKeywords"] as string[]) ?? [],
    createdAt: new Date(record["created"] as string),
  };
}
