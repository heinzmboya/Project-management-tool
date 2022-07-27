<script setup lang="ts">
import { ElButton, ElForm, ElInput } from "element-plus";

import {
    createFolder,
    createFolderLoading,
    createFolderDone,
    createFolderError,
GETFOLDERS
} from "~/constants/query";

const props = defineProps<{ config: any }>();
const emit = defineEmits(["close"]);
const router = useRouter();
const user = useUserStore();

let name = $ref("");
const foldername = ref(null);

function onCreateFolder() {
    if (!name) return;
    const parent = props.config.parent;

    createFolder(
        { parent, name }
        // {
        //     // update: (cache, { data: { CreateFolder } }) => {
        //     //     let data = cache.readQuery({ query: GETFOLDERS });
        //     //     data = {
        //     //         ...data,
        //     //         getFolders: [...data.getFolders, CreateFolder]
        //     //     };
        //     //     cache.writeQuery({ query: GETFOLDERS, data });
        //     // }
            
        // }
    );
    createFolderDone(({ data: { createFolder } }) => {
        emit("close");
        router.push({
            name: "w-folder-id",
            params: { id: createFolder.id }
        });
        console.log("success!"); // For now just print
    });

    createFolderError(({ error }) => {
        console.log(error);
    });

    // this.$apollo
    //     .mutate({
    //         mutation: CreateFolder,
    //         variables: { name, parent },
    //         update: (store, { data: { createFolder } }) => {
    //             const variables = parent ? { parent } : {};
    //             try {
    //                 const data = store.readQuery({
    //                     query: GetFolders,
    //                     variables
    //                 });
    //                 data.getFolders.push(createFolder);
    //                 store.writeQuery({
    //                     query: GetFolders,
    //                     variables,
    //                     data
    //                 });
    //             } catch (err) {
    //                 console.log(err);
    //             }
    //         }
    //     })
}

onMounted(() => {
    foldername.value?.focus();
});
</script>
<template>
    <div class="modal-mask white" @click="$emit('close')">
        <div class="modal-wrapper">
            <div
                class="modal-container"
                @click.stop="user.changeActiveWidget(null)"
            >
                <h3>Create folder</h3>
                <el-form @submit.native.prevent="onCreateFolder">
                    <el-input
                        type="text"
                        name="foldername"
                        ref="foldername"
                        v-model="name"
                        placeholder="folder name"
                        @keyup.esc="$emit('close')"
                    >
                    </el-input>
                </el-form>
                <div class="button-group">
                    <el-button type="primary" @click="onCreateFolder"
                        >Create</el-button
                    >
                    <el-button @click="$emit('close')">Cancel</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
