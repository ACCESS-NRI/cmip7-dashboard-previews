// @vitest-environment nuxt
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { useActiveSection } from "~/composables/useActiveSection";

type IOCallback = (
  entries: Array<{ target: Element; isIntersecting: boolean }>,
) => void;

let ioCallback: IOCallback | null = null;
const observed: Element[] = [];

// Minimal IntersectionObserver stub: captures the callback so tests can drive
// intersection events directly, and records what was observed.
class StubIntersectionObserver {
  constructor(cb: IOCallback) {
    ioCallback = cb;
  }
  observe(el: Element) {
    observed.push(el);
  }
  disconnect() {}
  unobserve() {}
}

function fire(entries: Array<{ id: string; isIntersecting: boolean }>) {
  ioCallback?.(
    entries.map((e) => ({
      target: document.getElementById(e.id)!,
      isIntersecting: e.isIntersecting,
    })),
  );
}

const Harness = defineComponent({
  setup() {
    return { ...useActiveSection(["a", "b", "c"]) };
  },
  template: '<div data-test="active">{{ activeId }}</div>',
});

describe("useActiveSection", () => {
  beforeEach(() => {
    ioCallback = null;
    observed.length = 0;
    vi.stubGlobal("IntersectionObserver", StubIntersectionObserver);
    for (const id of ["a", "b", "c"]) {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    for (const id of ["a", "b", "c"]) document.getElementById(id)?.remove();
  });

  it("defaults to the first section and observes every element", async () => {
    const wrapper = await mountSuspended(Harness);

    expect(wrapper.find('[data-test="active"]').text()).toBe("a");
    expect(observed.map((el) => el.id)).toEqual(["a", "b", "c"]);
  });

  it("tracks the earliest section currently in view", async () => {
    const wrapper = await mountSuspended(Harness);

    fire([{ id: "b", isIntersecting: true }]);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-test="active"]').text()).toBe("b");

    // c also enters, but b is still visible and earlier in order, so it wins.
    fire([{ id: "c", isIntersecting: true }]);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-test="active"]').text()).toBe("b");

    // b leaves the viewport; only c remains visible.
    fire([{ id: "b", isIntersecting: false }]);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-test="active"]').text()).toBe("c");
  });
});
