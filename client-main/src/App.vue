<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
// import { defineComponent } from 'vue'
import { ElConfigProvider } from "element-plus";

useHead({
    title: "Vitesse1",
    meta: [
        { name: "description", content: "Opinionated Vite Starter Template" },
        {
            name: "theme-color",
            content: computed(() => (isDark.value ? "#00aba9" : "#ffffff"))
        }
    ],
    link: [
        {
            rel: "icon",
            type: "image/svg+xml",
            href: computed(() =>
                preferredDark.value ? "/favicon-dark.svg" : "/favicon.svg"
            )
        }
    ]
});

// const zIndex = ref(3000);
// const size = ref("small");
</script>

<template>
    <el-config-provider size="default" :z-index="3000">
        <RouterView />

        <!-- <app /> -->
    </el-config-provider>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap");
</style>
