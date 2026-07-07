<template>
  <button class="widget">Save</button>
</template>

<script>
import { helper } from "./helper";
export default {
  name: "Widget",
  methods: { helper },
};
</script>

<script setup>
import { helper2 } from "./helper2";
helper2();
</script>
