// @vitest-environment nuxt
import type { NavigationMenuItem } from "@nuxt/ui";
import { defineComponent } from "vue";
import { describe, expect, it, vi } from "vitest";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import DefaultLayout from "../default.vue";

const currentPath = vi.hoisted(() => ({ value: "/" }));

mockNuxtImport("useRoute", () => () => ({ path: currentPath.value }));

// Capture the items the layout hands to the nav menu without depending on the
// nuxt-ui NavigationMenu internals for active styling.
const capturedItems: NavigationMenuItem[][] = [];
const NavStub = defineComponent({
  props: { items: { type: Array, default: () => [] } },
  setup(props) {
    capturedItems.push(props.items as NavigationMenuItem[]);
    return () => null;
  },
});

async function navItemsFor(path: string): Promise<NavigationMenuItem[]> {
  currentPath.value = path;
  capturedItems.length = 0;
  await mountSuspended(DefaultLayout, {
    global: {
      stubs: {
        UHeader: { template: "<div><slot /><slot name='body' /></div>" },
        UMain: { template: "<div><slot /></div>" },
        UNavigationMenu: NavStub,
        GitCommit: true,
      },
    },
  });
  return capturedItems[0]!;
}

function itemByLabel(
  items: NavigationMenuItem[],
  label: string,
): NavigationMenuItem {
  const item = items.find((i) => i.label === label);
  expect(item, `nav item "${label}"`).toBeTruthy();
  return item!;
}

describe("default layout navigation", () => {
  it("marks Dashboard as an exact-match link", async () => {
    const items = await navItemsFor("/");
    const dashboard = itemByLabel(items, "Dashboard");
    expect(dashboard.to).toBe("/");
    expect(dashboard.exact).toBe(true);
  });

  // Blog nav item is currently commented out in SiteHeader.vue. Assert the
  // expected items are present and Blog is not, so this catches an accidental
  // reintroduction (and flags us to restore the active-state tests) either way.
  it("exposes Dashboard and Glossary but not Blog", async () => {
    const labels = (await navItemsFor("/")).map((i) => i.label);
    expect(labels).toContain("Dashboard");
    expect(labels).toContain("Glossary");
    expect(labels).not.toContain("Blog");
  });
});
