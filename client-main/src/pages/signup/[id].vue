<script setup lang="ts">
const props = defineProps<{ id: string }>()
</script>

<template>
    <div class="w-md mx-auto">
        id {{id}}
        <form-signup :id="id" />
    </div>
</template>

<style scoped></style>
