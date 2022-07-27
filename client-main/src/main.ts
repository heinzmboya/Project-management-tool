import { ViteSSG } from "vite-ssg";
import { setupLayouts } from "virtual:generated-layouts";
// import { DefaultApolloClient } from '@vue/apollo-composable'
// import { apolloClient } from './ApolloClient'

import App from "./App.vue";
import generatedRoutes from "~pages";

import 'element-plus/es/components/message/style/css'
import "@unocss/reset/tailwind.css";
import './styles/main.css'
import "uno.css";

import hel from "/src/pages/w/folder/[id].vue";

const routes = setupLayouts(generatedRoutes);

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
    // {
    //   setup() {
    //     // provide(DefaultApolloClient, apolloClient)
    //   },

    //   render: () => h(App),
    // },
    App,
    { routes, base: import.meta.env.BASE_URL },
    ctx => {
        // install all modules under `modules/`
        Object.values(import.meta.globEager("./modules/*.ts")).forEach(i =>
            i.install?.(ctx)
        );

        ctx.router.beforeEach(async (to, from, next) => {
            const isAuthenticated = localStorage.getItem("user-id");

            if (to.matched.some(record => record.meta.requiresAuth)) {
                if (!isAuthenticated) {
                    // console.log('to1', to);
                    next({ name: "login" });
                    return;
                }
            } else if (to.matched.some(record => record.meta.redirect)) {
                if (isAuthenticated) {
                    next({ name: "workspace" });
                    return;
                }
            }
            next();
            // console.log('to', to);

            // if (to.name !== 'login' && !isAuthenticated) next({ name: 'login' })
            // else next()
        });
    }
);
