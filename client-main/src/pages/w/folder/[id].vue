<script setup lang="ts">
import { FOLDER_FIELDS } from "~/constants/query";

import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

import { ElCol, ElRow } from "element-plus";

const router = useRouter();

const props = defineProps<{ id: string }>();

const { result: GetFolder } = useQuery(
    gql`
        ${FOLDER_FIELDS}
        query GetFolder($id: String!) {
            getFolder(id: $id) {
                ...FolderFields
            }
        }
    `,
    props
);

const folder = computed(() => {
    // console.log("GetFolder", GetFolder.value?.getFolder);
    return (
        GetFolder.value?.getFolder ?? {
            shareWith: []
        }
    );
});

let subRoute = $ref("folder");
let folderName = $ref("");

function isTeam(folder: any) {
    return !folder?.parent && folder?.shareWith?.length === 0;
}

function tt() {
    console.log(GetFolder.value, router);
}
</script>
<template>
    <div>
        <button @click="tt">log</button>
        {{ id }}
        <div>
            {{ folder?.id }}
        </div>
        <div>
            {{ folder?.name }}
        </div>
        <div>
            {{ folder?.shareWith }}
        </div>
        <div>
            {{ folder?.parent }}
        </div>
        <el-row class="max-height">
            <el-col :span="12" class="max-height">
                <div class="white card max-height">
                    <div class="folder-header">
                        <div class="header-title folder-name">
                            {{ folder?.name }}
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col
                v-if="!isTeam(folder) && subRoute === 'folder'"
                :span="12"
                class="max-height"
            >
                <FolderDetail :folder="folder"></FolderDetail>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped></style>
