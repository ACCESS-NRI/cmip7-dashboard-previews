// @vitest-environment nuxt
import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DetailSection from "../DetailSection.vue";

function mountSection(props: Record<string, unknown> = {}) {
  return mountSuspended(DetailSection, {
    props: {
      id: "progress",
      title: "Progress",
      description: "How far each experiment has run",
      icon: "i-lucide-gauge",
      ...props,
    },
    slots: { default: () => "panel body content" },
  });
}

describe("DetailSection", () => {
  it("renders the header and starts collapsed", async () => {
    const wrapper = await mountSection();

    expect(wrapper.text()).toContain("Progress");
    expect(wrapper.text()).toContain("How far each experiment has run");
    expect(wrapper.text()).toContain("Detailed view");

    const toggle = wrapper.find('[data-test="detail-section-toggle-progress"]');
    expect(toggle.attributes("aria-expanded")).toBe("false");
    // v-show hides the panel via an inline display:none while collapsed.
    expect(
      wrapper
        .find('[data-test="detail-section-panel-progress"]')
        .attributes("style"),
    ).toContain("display: none");
  });

  it("exposes the id as an anchor target", async () => {
    const wrapper = await mountSection();
    expect(wrapper.find("#progress").exists()).toBe(true);
  });

  it("expands and collapses when the header is clicked", async () => {
    const wrapper = await mountSection();
    const toggle = wrapper.find('[data-test="detail-section-toggle-progress"]');
    const panel = wrapper.find('[data-test="detail-section-panel-progress"]');

    await toggle.trigger("click");
    expect(toggle.attributes("aria-expanded")).toBe("true");
    expect(panel.attributes("style") ?? "").not.toContain("display: none");
    expect(panel.text()).toContain("panel body content");

    await toggle.trigger("click");
    expect(toggle.attributes("aria-expanded")).toBe("false");
    expect(panel.attributes("style")).toContain("display: none");
  });

  it("supports v-model:open, emitting update:open on toggle", async () => {
    const wrapper = await mountSection({ open: true });

    expect(
      wrapper
        .find('[data-test="detail-section-toggle-progress"]')
        .attributes("aria-expanded"),
    ).toBe("true");

    await wrapper
      .find('[data-test="detail-section-toggle-progress"]')
      .trigger("click");

    expect(wrapper.emitted("update:open")?.at(-1)).toEqual([false]);
  });
});
