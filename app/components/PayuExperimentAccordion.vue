<template>
  <section
    class="mx-auto mb-12 max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
    aria-label="Payu experiment runs"
  >
    <div class="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
      <h2
        class="text-sm font-semibold uppercase text-gray-700 dark:text-gray-200"
      >
        Experiment runs
      </h2>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      data-test="payu-loading"
      class="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500"
    >
      Loading experiments…
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      data-test="payu-error"
      class="px-5 py-6 text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- Empty state -->
    <div
      v-else-if="experiments.length === 0"
      data-test="payu-empty"
      class="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500"
    >
      {{ emptyMessage }}
    </div>

    <!-- Accordion list -->
    <UAccordion
      v-else
      v-model="openPanels"
      type="multiple"
      :items="items"
      :unmount-on-hide="false"
      class="px-2 py-1"
      data-test="payu-accordion"
    >
      <template #default="{ item }">
        <div
          class="flex min-w-0 flex-1 items-center gap-4"
          data-test="accordion-trigger"
        >
          <span
            class="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 dark:text-gray-100"
          >
            {{ item.experiment.name }}
          </span>
          <span class="shrink-0 text-xs text-gray-400 dark:text-gray-400">
            {{ item.experiment.modelCurrentTime }}
          </span>
          <span
            class="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            {{ item.experiment.yearsRun }} yrs
          </span>
          <span
            class="shrink-0 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          >
            {{ item.experiment.serviceUnitsDisplay }} SU
          </span>
        </div>
      </template>

      <template #content="{ item }">
        <dl
          class="grid grid-cols-1 gap-y-2 px-1 py-2 sm:grid-cols-2"
          data-test="accordion-content"
        >
          <template
            v-for="[key, value] in Object.entries(item.experiment.details)"
            :key="key"
          >
            <div class="min-w-0">
              <dt
                class="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500"
              >
                {{ formatKey(key) }}
              </dt>
              <dd
                class="mt-0.5 break-all text-sm text-gray-700 dark:text-gray-300"
              >
                {{ formatValue(value) }}
              </dd>
            </div>
          </template>
        </dl>
      </template>
    </UAccordion>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { AccordionItem } from "@nuxt/ui";
import type { PayuExperiment } from "~/services/payuExperiments";

const props = withDefaults(
  defineProps<{
    experiments: PayuExperiment[];
    loading?: boolean;
    error?: string | null;
    emptyMessage?: string;
  }>(),
  {
    loading: false,
    error: null,
    emptyMessage: "No experiment runs found.",
  },
);

// Map experiments onto nuxt-ui accordion items; the full experiment is carried
// on each item so the trigger/content slots can render its fields.
type PayuAccordionItem = AccordionItem & { experiment: PayuExperiment };

const items = computed<PayuAccordionItem[]>(() =>
  props.experiments.map((experiment) => ({
    value: experiment.uuid,
    label: experiment.name,
    experiment,
  })),
);

// Track open panel UUIDs; multiple open at once is always allowed.
const openPanels = ref<string[]>([]);

// Expose for testing
defineExpose({ openPanels });

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatKey(key: string): string {
  return key.replaceAll("_", " ");
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  return String(value);
}
</script>
