<script setup lang="ts">
const props = defineProps<{ size?: string; color?: string }>();

const circleColor = {
    white: "rgba(255,255,255,.6)",
    grey: "rgba(0, 0, 0, 0.32)"
};
const plusColor = {
    white: "#fff",
    grey: "rgba(0, 0, 0, 0.32)"
};
</script>
<template>
    <div
        class="plus-button flex cursor-pointer w-4 h-4"
        @click.stop="$emit('click')"
    >
        <svg :height="size || 16" :width="size || 16" viewBox="0 0 15 15">
            <g fill-rule="evenodd">
                <path
                    fill="current"
                    d="M7.5 15a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zm0-1a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"
                ></path>
                <path
                    fill="current"
                    d="M7 7H4v1h3v3h1V8h3V7H8V4H7v3z"
                    id="plus_light_icon"
                ></path>
            </g>
        </svg>
    </div>
</template>

<style lang="scss" scoped></style>
