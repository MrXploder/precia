/**
 * useTheme — manages light/dark mode for Precia via SaxVue's $sv API.
 *
 * SaxVue installs a set of utilities on `app.config.globalProperties.$sv`:
 *
 *   $sv.setTheme('dark' | 'light')  — force a specific theme
 *   $sv.toggleTheme()               — flip the current theme, returns new value
 *
 * Both functions handle DOM (`document.body[vs-theme]`), localStorage
 * (`vsTheme`), and the `vs-remove-transition` guard internally.
 *
 * Implementation notes:
 *   - `$sv` is captured lazily via `getCurrentInstance()` on the first
 *     `useTheme()` call, which always happens inside a component's setup().
 *   - Initial theme is applied immediately at module load (before the Vue
 *     app exists) to avoid a flash of unstyled content. This replicates
 *     saxvue's own logic since $sv is not yet available at that point.
 *   - Subsequent toggles go through `$sv.toggleTheme()` so saxvue stays
 *     in full control of DOM + storage.
 *   - NOTE: `$sv.setTheme()` has a known bug — it persists the OLD theme
 *     to localStorage instead of the requested one. We use it only for
 *     initialization where the return value is irrelevant. For toggling
 *     we use `$sv.toggleTheme()` which correctly flips both DOM and storage.
 *
 * Usage:
 *   const { isDark, toggleTheme } = useTheme()
 */
import { ref, getCurrentInstance } from "vue";

type SvApi = {
  setTheme: (theme: "dark" | "light") => "dark" | "light";
  toggleTheme: () => "dark" | "light";
};

/** Module-level reactive state — shared across all component instances. */
const isDark = ref<boolean>(
  localStorage["vsTheme"] === "dark" ||
    (!localStorage["vsTheme"] &&
      window.matchMedia("(prefers-color-scheme: dark)").matches),
);

/**
 * Minimal bootstrap applied before the Vue app exists.
 * Prevents a flash of wrong theme on first paint.
 * Mirrors saxvue's internal logic exactly.
 */
function bootstrapTheme(dark: boolean): void {
  document.body.classList.add("vs-remove-transition");
  if (dark) {
    document.body.setAttribute("vs-theme", "dark");
  } else {
    document.body.removeAttribute("vs-theme");
  }
  localStorage["vsTheme"] = dark ? "dark" : "light";
  setTimeout(() => document.body.classList.remove("vs-remove-transition"), 100);
}

bootstrapTheme(isDark.value);

/** Lazily resolved $sv reference — set once on first useTheme() call. */
let $sv: SvApi | null = null;

export function useTheme() {
  // Resolve $sv on first call. getCurrentInstance() is valid here because
  // useTheme() is always called from inside a component's setup().
  if (!$sv) {
    const instance = getCurrentInstance();
    $sv =
      (instance?.appContext.config.globalProperties["$sv"] as unknown as SvApi) ?? null;
  }

  function toggleTheme(): void {
    if ($sv) {
      // $sv.toggleTheme() handles DOM, localStorage, and vs-remove-transition.
      // It returns the new theme ('dark' | 'light').
      const next = $sv.toggleTheme();
      isDark.value = next === "dark";
    } else {
      // Fallback if $sv is somehow unavailable (e.g. tests).
      bootstrapTheme(!isDark.value);
      isDark.value = !isDark.value;
    }
  }

  return { isDark, toggleTheme };
}
