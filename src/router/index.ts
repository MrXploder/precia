/**
 * Application router.
 *
 * Route structure (Phase 1):
 *   /           → redirects to /lists
 *   /lists      → ShoppingListsView   (all lists)
 *   /lists/:id  → ShoppingListDetailView (single list)
 *
 * Route names are used for programmatic navigation so that path
 * changes never require updating every `router.push` call site.
 */
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import ShoppingListsView from "@/views/ShoppingListsView.vue";
import ShoppingListDetailView from "@/views/ShoppingListDetailView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/lists",
  },
  {
    path: "/lists",
    name: "shopping-lists",
    component: ShoppingListsView,
  },
  {
    path: "/lists/:id",
    name: "shopping-list-detail",
    component: ShoppingListDetailView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
