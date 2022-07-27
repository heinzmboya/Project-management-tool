<script setup lang="ts">
import { ElButton, ElDialog } from "element-plus";
// import {
//   GetTeam,
// } from '~/constants/query'

import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

import { GETFOLDERS } from "~/constants/query";

const { result: GetTeam } = useQuery(gql`
    query GetTeam {
        getTeam {
            id
            name
        }
    }
`);

const { result, onError } = useQuery(GETFOLDERS);
const folders = $computed(() => result.value?.getFolders || []);

onError(error => {
    console.log(error);
});

const user = useUserStore();
const activeWidget = $computed(() => user.activeWidget);

let showModal = $ref(false);
const team = computed(() => GetTeam.value?.getTeam ?? {});

function openModal() {
    user.changeActiveWidget(null);
    showModal = true;
}

function logGetTeam() {
    console.log(result.value)
}
</script>

<template>
    <div>
        <div class="flex">
            <aside class="tree-root w-1/5 xl:w-1/6 border-r bg-#1D2227 text-white">
                <button @click="logGetTeam">log log</button>

                <div
                    v-if="team.id"
                    class="tree-item bg-blue-200/20 cursor-pointer"
                    @click.right.stop.prevent="
                        user.changeActiveWidget(`folder${team.id}`)
                    "
                    @click.left.stop="
                        $router.push({
                            name: 'w-folder-id',
                            params: { id: team.id }
                        })
                    "
                >
                    <div
                        class="tree-plate flex items-center space-x-3 py-1"
                        v-bind:class="{
                            active: $route.params.id === team.id
                        }"
                    >
                        <div class="circle w-2 h-2 bg-gray-200 rounded-1"></div>
                        <span class="folder no-select-color teamname">{{
                            team.name
                        }}</span>

                        <plus-button
                            @click="openModal"
                        ></plus-button>
                            <!-- color="white" -->

                        <div
                            class="dropdown-content left"
                            v-show="activeWidget === `folder${team.id}`"
                        >
                            <div @click="openModal">Add Folder</div>
                        </div>
                    </div>
                </div>

                {{folders?.length }}

                <FolderTree
                    v-for="folder in folders"
                    :key="folder.id"
                    :model="folder"
                    :team="team.id"
                >
                </FolderTree>
            </aside>
            <div class="workspace-main flex-1">
                <div class="text-xs text-blue-500">
                    above router view that renders w's children
                    {{ $route.fullPath }}
                </div>
                <router-view :key="$route.fullPath"> </router-view>
            </div>

            <el-dialog v-model="showModal" title="Tips" width="30%">
                <!-- v-if="showModal" -->
                <FolderForm
                    :config="{ parent: '' }"
                    @close="showModal = false"
                ></FolderForm>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="showModal = false">Cancel</el-button>
                        <el-button type="primary" @click="showModal = false"
                            >Confirm</el-button
                        >
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<route lang="yaml">
meta:
    lang: yml
    # requiresAuth: true
</route>

<style scoped></style>
