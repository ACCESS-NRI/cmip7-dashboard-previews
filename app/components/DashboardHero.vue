<script setup lang="ts">
import type { PayuExperiment } from "~/services/payuExperiments";
import accessLogo from "~/assets/ACCESS-logo.svg";

// Purely presentational: the page owns the fetch, this renders whichever of
// loading / error / empty / totals applies.
defineProps<{
  experiments: PayuExperiment[];
  loading: boolean;
  error: string | null;
}>();
</script>

<template>
  <section
    id="hero"
    class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
  >
    <div class="grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)]">
      <!-- Brand rail: the title + logo row stacks on top of the tagline at
           every breakpoint. -->
      <div
        class="flex flex-col items-start gap-4"
      >
        <div class="flex-2 md:flex-none">
          <div class="flex items-center gap-3">
            <h1
              class="text-2xl font-semibold text-gray-800 sm:text-3xl dark:text-gray-100"
            >
              CMIP7 Dashboard
            </h1>
            <a
              href="https://www.access-nri.org.au"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ACCESS-NRI"
              class="flex items-center"
            >
              <img :src="accessLogo" alt="ACCESS-NRI" class="h-24 object-contain" />
            </a>
          </div>
        </div>
        <div class="flex-1 md:flex-none">
          <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Tracking Australia's contribution to CMIP7: the next generation climate model intercomparison project.
          </p>
        </div>
      </div>

      <!-- Stat zone: divider flips from a top rule (stacked) to a left rule
           (side by side). Hosts the loading/error/empty states and totals. -->
      <div
        class="border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6 dark:border-gray-700"
      >
        <div
          v-if="loading"
          data-test="experiments-loading"
          class="flex h-full items-center justify-center py-6 text-sm text-gray-400 dark:text-gray-500"
        >
          Loading experiments…
        </div>

        <div
          v-else-if="error"
          data-test="experiments-error"
          class="flex h-full items-center justify-center py-6 text-sm text-red-600 dark:text-red-400"
        >
          {{ error }}
        </div>

        <div
          v-else-if="experiments.length === 0"
          data-test="experiments-empty"
          class="flex h-full items-center justify-center py-6 text-sm text-gray-400 dark:text-gray-500"
        >
          No experiments found.
        </div>

        <ExperimentTotals v-else :experiments="experiments" />
      </div>
    </div>
  </section>
</template>
