<script setup lang="ts">
import type { ContentCollectionItem } from "@nuxt/content";

defineProps<{ post: ContentCollectionItem }>();

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
</script>

<template>
  <article>
    <header class="mb-6">
      <div
        v-if="post.date || post.author"
        class="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500"
      >
        {{ formatDate(post.date) }}
        <span v-if="post.author"> · {{ post.author }}</span>
      </div>
    </header>
    <ContentRenderer :value="post" class="prose dark:prose-invert max-w-none" />
  </article>
</template>
