<script setup lang="ts">
const props = defineProps<{ name?: string }>()
</script>

<template>
    <div class="w-md mx-auto">
         name {{name}}
        <form-signup />
    </div>
</template>

<style scoped></style>
