# Precia — Architecture Overview

Precia helps users optimize their supermarket shopping lists by comparing prices across multiple stores.

The system is designed around three core problems: **shopping list management**, **canonical product matching**, and **price discovery**.

> **Core question Precia answers:**
> _"What is the cheapest way to buy my entire shopping list?"_
> — not _"Where is this product cheapest?"_

This distinction drives every architectural decision: state is organised around lists, not products; the optimisation unit is the basket, not the item.

---

## Core Concept

Users build shopping lists composed of canonical products from the catalog.

```
FindeMes
├── Azúcar 1kg           × 2
├── Leche Colun 200ml    × 6
└── Detergente OMO 5L    × 1
```

In future phases, the system will search prices across supermarkets and recommend the cheapest combination of stores to fulfil the list.

---

## System Components

```
┌─────────────────────────────────────────────┐
│              Vue Frontend (Phase 1+)         │
│  Shopping list management · Price results   │
└────────────────────┬────────────────────────┘
                     │  PocketBase REST API / JS SDK
┌────────────────────▼────────────────────────┐
│        PocketBase Backend (Phase 1+)         │
│  Auth · Database (SQLite) · REST API         │
│  Admin UI · File storage                     │
└────────────────────┬────────────────────────┘
                     │  Phase 3+
┌────────────────────▼────────────────────────┐
│         Scraper Workers (Phase 3+)           │
│  Collect prices periodically per store/zone  │
└─────────────────────────────────────────────┘
```

---

## Domain Entities

### Phase 1 — Shopping lists

#### `ProductCatalog`

A **canonical product definition** that represents what a user _means_ when they add an item to a list.

```
id                   unique identifier
name                 human-readable name ("Leche Colun semidescremada 200ml")
type                 'generic' | 'specific'
preferredBrand?      preferred brand for specific products
strictBrand          whether only the exact brand is accepted
targetQuantity       reference quantity used for price comparison
unit                 kg | gr | lt | ml | unit
volumeTolerancePct   allowed size deviation % for equivalent products
```

**Generic** products allow any brand substitution.  
**Specific** products may require an exact brand match.

#### `ShoppingList`

A named list of products belonging to a user.

```
id
userId
name       "FindeMes" | "Asado familiar" | "Cumpleaños"
createdAt
```

#### `ShoppingListItem`

A product entry inside a list.

```
id
shoppingListId
productId
quantity
```

---

### Phase 2 — Stores and pricing

#### `Store`

A supermarket chain.

```
id
name     "Lider" | "Jumbo" | "Unimarc" | "Tottus"
country
```

#### `StoreProduct`

A product found in a specific store at a given time and zone.
Created by scraper workers.

```
id
storeId
name          raw name from the store ("AZUCAR IANSA 1KG")
brand
quantity
unit
price
zone          geographic zone where the price applies
scrapedAt
```

#### `PriceSearch`

Represents the result of a "Buscar precios" operation.
Allows caching previous searches so repeated requests are fast.

```
id
shoppingListId
createdAt
zone
```

---

## The Zone Concept

Supermarket prices in Chile vary by geographic zone.
Precia uses zones to return localised prices.

Example zones:
```
santiago-centro
santiago-norte
santiago-oriente
```

The frontend detects the user's zone via browser geolocation and passes it with every price search request.

---

## The Hardest Problems

### 1. Product Matching

Matching a canonical `ProductCatalog` entry against raw `StoreProduct` names:

```
Canonical:  "Azúcar 1kg"  (generic)

Store data:
  "AZUCAR IANSA 1KG"
  "Azucar blanca Iansa 1 kilo"
  "Azucar Iansa bolsa 1kg"
```

All three refer to the same product.
The matching engine must normalise, tokenise, and score candidates.

### 2. Volume Equivalence

Products are not always the same size.
`volumeTolerancePct` on `ProductCatalog` defines the acceptable deviation.

```
User wants:   Aceite Vegetal 1L
Store has:    Aceite Vegetal 900ml  →  within 10% tolerance → valid match
Store has:    Aceite Vegetal 500ml  →  outside tolerance   → rejected
```

### 3. List Optimisation

The system must find the cheapest combination of stores to fulfil an entire list,
not just the cheapest price per individual item.

```
User list:  Azúcar 1kg + Fideos 400g + Leche 1L

Option A:  Buy all at Jumbo        → $4.200
Option B:  Azúcar @ Lider +
           Fideos @ Unimarc +
           Leche @ Tottus          → $3.750  ← recommended
```

Optimisation must factor in the number of store trips vs. savings.

---

## Unit Price Normalisation

All price comparisons are normalised to a price-per-unit figure so that
products with different package sizes can be compared fairly.

```
Azúcar 1kg   @ $1.290  →  $1.290 / kg
Azúcar 1.2kg @ $1.400  →  $1.167 / kg  ← cheaper per unit
```

The domain utility `computeUnitPrice(price, quantity)` performs this calculation.
Every component or service that displays or compares prices must use it —
never compare raw prices between differently-sized products.

---

## Basket Optimisation Result Shape

The optimiser groups matched products into per-store baskets.
The domain type `BasketOptimizationResult` defines the expected output:

```
BasketOptimizationResult
├── baskets[]
│   ├── StoreBasket (storeId: "lider")
│   │   ├── BasketItem → Azúcar 1kg     $1.290  ($1.290/kg)
│   │   └── BasketItem → Arroz 1kg      $  890
│   └── StoreBasket (storeId: "jumbo")
│       ├── BasketItem → Leche Colun    $  490
│       └── BasketItem → Detergente OMO $3.990
└── totalPrice: $6.660
```

The UI renders one card per store in the result.

---

## Phase Roadmap

| Phase | Scope                                                   | Status      |
| ----- | ------------------------------------------------------- | ----------- |
| 1     | Shopping list management + product catalog (PocketBase) | ✅ Active   |
| 2     | Auth + full PocketBase persistence                      | Planned     |
| 3     | Store catalog + scraper workers                         | Planned     |
| 4     | Product matching engine                                 | Planned     |
| 5     | Price search + list optimisation                        | Planned     |

---

## Frontend Architecture

See [CODING_RULES.md](./CODING_RULES.md) for the layer rules and [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

```
src/
├── domain/       Framework-agnostic interfaces for all domain entities
│   ├── productUtils.ts       ← computeUnitPrice, isWithinVolumeTolerance
│   └── BasketOptimization.ts ← optimisation result shape
├── services/     PocketBase data access (mock catalog in Phase 1)
│   ├── pocketbase.ts         ← singleton PocketBase client
│   ├── authService.ts        ← signup, login, logout
│   ├── shoppingListService.ts
│   ├── shoppingListItemService.ts
│   └── productCatalogService.ts
├── composables/  Reactive state and business operations
├── components/   Presentational UI building blocks
├── views/        Pages — wire composables to components
└── router/       Route definitions
```

Import rule:
```
views → composables → services → domain
components → composables → domain
domain → (nothing)
```
