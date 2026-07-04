<script setup lang="ts">
import { computed } from "vue";
import type { ContentCollectionItem } from "@nuxt/content";
import { useDetailLevel } from "~/composables/useDetailLevel";
import type { PayuExperiment } from "~/services/payuExperiments";

const props = defineProps<{
  experiment: PayuExperiment;
  /** Explainer post tagged with this experiment's name, if one exists. */
  post?: ContentCollectionItem | null;
}>();

const level = useDetailLevel();

const furtherReading = computed(() => props.post?.furtherReading ?? []);
</script>

<!-- Per-experiment card for the Overview and Status detail levels; the Detail
     level shows PayuExperimentAccordion instead of the card grid. -->
<template>
  <section
    class="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    :aria-label="`Experiment ${experiment.name}`"
    data-test="experiment-card"
  >
    <header class="mb-4 flex items-baseline justify-between gap-3">
      <h3
        class="truncate text-base font-semibold text-gray-800 dark:text-gray-100"
      >
        {{ experiment.name }}
      </h3>
    </header>

    <!-- Overview: the explainer's one-liner, expandable to the full article. -->
    <div v-if="level === 0" data-test="card-overview">
      <template v-if="post">
        <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {{ post.description }}
        </p>
        <UCollapsible class="mt-3">
          <template #default="{ open }">
            <UButton
              variant="link"
              color="primary"
              :label="open ? 'Show less' : 'Read more'"
              :trailing-icon="
                open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
              "
              class="px-0"
              data-test="overview-toggle"
            />
          </template>
          <template #content>
            <ContentRenderer
              :value="post"
              class="prose prose-sm dark:prose-invert mt-2 max-w-none"
              data-test="overview-article"
            />
            <FurtherReading
              v-if="furtherReading.length"
              :links="furtherReading"
              class="mt-4"
            />
          </template>
        </UCollapsible>
      </template>
      <p
        v-else
        class="text-sm italic text-gray-400 dark:text-gray-500"
        data-test="overview-placeholder"
      >
        Explainer coming soon.
      </p>
    </div>

    <!-- Status: progress and publication state at a glance. -->
    <div v-else class="space-y-3" data-test="card-status">
      <ExperimentProgress
        :years-run="experiment.yearsRun"
        :expected-years-run="experiment.expectedYearsRun"
      />
      <EsgfStatus
        :published="experiment.esgfPublished"
        class="text-xs text-gray-500 dark:text-gray-400"
      >
        ESGF published
      </EsgfStatus>
    </div>
  </section>
</template>
